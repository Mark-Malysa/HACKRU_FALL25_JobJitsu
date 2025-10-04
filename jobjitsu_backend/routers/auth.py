from fastapi import APIRouter, HTTPException, Header
from services.auth_service import signup_user, login_user, verify_token
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
    result = signup_user(email, password)
    if not result or result.get("error"):
        raise HTTPException(status_code=400, detail="Signup failed")
    
    user = result.user
    if not db.users.find_one({"email": user.email}):
        db.users.insert_one({
            "_id": user.id,
            "email": user.email,
            "created_at": datetime.utcnow()
        })

    return {"message": "Signup successful", "user": user.email}

@router.post("/auth/login")
def login(email: str, password: str):
    result = login_user(email, password)
    if not result or result.get("error"):
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

# Note: OAuth authentication is handled by Supabase on the frontend
# This backend syncs OAuth users with MongoDB for session management