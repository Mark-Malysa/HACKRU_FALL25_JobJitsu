from unittest import result
from fastapi import APIRouter, HTTPException, Header, Depends
from services.auth_service import signup_user, login_user, verify_token
from services.auth_guard import get_current_user
import sys
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables before importing db_service
load_dotenv()

# Initialize database connection directly
mongo_uri = os.getenv("MONGO_URI")
db_name = os.getenv("DB_NAME")

if mongo_uri and db_name:
    client = MongoClient(mongo_uri)
    db = client[db_name]
    print(f"Database connected: {db_name}")
else:
    print("MongoDB credentials not found")
    db = None

from datetime import datetime

router = APIRouter()


@router.post("/auth/signup")
def signup(email: str, password: str):
    print(f"Attempting to signup user with email: {email}")
    # Check if user already exists in MongoDB
    existing_user = db.users.find_one({"email": email})
    if existing_user:
        print("User already exists in DB, attempting login...")
        login_result = login_user(email, password)
        if not login_result or getattr(login_result, "session", None) is None:
            raise HTTPException(status_code=401, detail="Login failed for existing user")
        session = login_result.session
        return {
            "message": "User already exists. Logged in instead.",
            "token": session.access_token,
            "expires_at": session.expires_at,
            "user": email
        }
    # If not, proceed with signup
    result = signup_user(email, password)
    print(f"Signup result: {result}")
    if not result or getattr(result, "user", None) is None:
        raise HTTPException(status_code=400, detail="Signup failed")

    user = result.user
    if not user:
        raise HTTPException(status_code=400, detail="No user returned from Supabase")
    db.users.insert_one({
        "_id": user.id,
        "email": user.email,
        "created_at": datetime.utcnow()
    })

    return {"message": "Signup successful", "user": user.email}

@router.post("/auth/login")
def login(email: str, password: str):
    result = login_user(email, password)
    if not result or getattr(result, "error", None):
        raise HTTPException(status_code=401, detail="Login failed")
    token = result.session.access_token
    return {
        "message": "Login successful",
        "token": result.session.access_token,
        "expires_at": result.session.expires_at
    }

@router.get("/auth/verify")
def verify(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    token = authorization.split(" ")[1]
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "Token valid", "user": user}

@router.post("/auth/sync-user")
def sync_user(user_data: dict):
    """Sync OAuth user data from frontend to MongoDB"""
    try:
        print(f"Database object: {db}")
        print(f"MongoDB URI: {os.getenv('MONGO_URI')}")
        print(f"DB Name: {os.getenv('DB_NAME')}")
        
        user_id = user_data.get("id")
        email = user_data.get("email")
        name = user_data.get("name", "")
        picture = user_data.get("picture", "")
        provider = user_data.get("provider", "oauth")
        
        if not user_id or not email:
            raise HTTPException(status_code=400, detail="Missing required user data")
        
        if db is None:
            raise HTTPException(status_code=500, detail="Database not configured")
        
        # Check if user already exists
        existing_user = db.users.find_one({"email": email})
        
        if existing_user:
            # Update existing user
            db.users.update_one(
                {"email": email},
                {
                    "$set": {
                        "name": name,
                        "picture": picture,
                        "provider": provider,
                        "last_login": datetime.utcnow()
                    }
                }
            )
            return {"message": "User updated", "user_id": str(existing_user["_id"])}
        else:
            # Create new user
            new_user = {
                "_id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "provider": provider,
                "created_at": datetime.utcnow(),
                "last_login": datetime.utcnow()
            }
            result = db.users.insert_one(new_user)
            return {"message": "User created", "user_id": str(result.inserted_id)}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync user: {str(e)}")

@router.get("/user/stats")
def get_user_stats(current_user=Depends(get_current_user)):
    """Get user statistics and recent sessions"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not configured")
        
        # Extract user ID from current_user
        user_id = None
        if hasattr(current_user, 'user') and hasattr(current_user.user, 'id'):
            user_id = current_user.user.id
        elif hasattr(current_user, 'id'):
            user_id = current_user.id
        elif hasattr(current_user, 'user_id'):
            user_id = current_user.user_id
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found")
        
        print(f"Getting stats for user: {user_id}")
        
        # Get all sessions for this user
        sessions_collection = db.sessions
        user_sessions = list(sessions_collection.find({"user_id": user_id}).sort("created_at", -1))
        
        print(f"Found {len(user_sessions)} sessions for user")
        
        # Calculate statistics
        total_sessions = len(user_sessions)
        scores = []
        recent_sessions = []
        
        for session in user_sessions:
            # Extract feedback score if available
            if session.get('feedback') and isinstance(session['feedback'], dict):
                score = session['feedback'].get('score', 0)
                if score > 0:
                    scores.append(score)
            
            # Prepare session data for recent sessions (limit to 10)
            if len(recent_sessions) < 10:
                session_data = {
                    "_id": str(session['_id']),
                    "user_id": session.get('user_id'),
                    "role": session.get('role', 'Unknown'),
                    "company": session.get('company', 'Unknown'),
                    "created_at": session.get('created_at', datetime.utcnow()).isoformat(),
                    "follow_up_question": session.get('follow_up_question'),
                    "follow_up_answer": session.get('follow_up_answer')
                }
                
                # Add feedback if available
                if session.get('feedback'):
                    if isinstance(session['feedback'], dict):
                        session_data['feedback'] = session['feedback']
                    else:
                        # Handle case where feedback is stored as string
                        session_data['feedback'] = {"score": 0, "description": str(session['feedback'])}
                
                recent_sessions.append(session_data)
        
        # Calculate averages
        average_score = sum(scores) / len(scores) if scores else 0
        best_score = max(scores) if scores else 0
        
        print(f"User stats: total={total_sessions}, avg={average_score}, best={best_score}")
        
        return {
            "totalSessions": total_sessions,
            "averageScore": round(average_score, 1),
            "bestScore": best_score,
            "recentSessions": recent_sessions
        }
        
    except Exception as e:
        print(f"Error getting user stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get user stats: {str(e)}")

# Note: OAuth authentication is handled by Supabase on the frontend
# This backend syncs OAuth users with MongoDB for session management