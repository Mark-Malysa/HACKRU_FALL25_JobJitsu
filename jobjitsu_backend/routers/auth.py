from fastapi import APIRouter, HTTPException, Header, Request
from services.auth_service import signup_user, login_user, verify_token
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from interviewHubDB.db_service import db
from datetime import datetime
import httpx

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

# OAuth Provider Routes
@router.get("/auth/google")
async def google_oauth():
    """Initiate Google OAuth flow"""
    google_client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")
    
    if not google_client_id:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={google_client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"scope=openid email profile&"
        f"response_type=code&"
        f"access_type=offline"
    )
    
    return {"auth_url": auth_url}

@router.post("/auth/google/callback")
async def google_callback(request: Request):
    """Handle Google OAuth callback"""
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not provided")
    
    google_client_id = os.getenv("GOOGLE_CLIENT_ID")
    google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")
    
    if not all([google_client_id, google_client_secret]):
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    # Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "client_id": google_client_id,
        "client_secret": google_client_secret,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri
    }
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=token_data)
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange code for token")
        
        tokens = token_response.json()
        access_token = tokens["access_token"]
        
        # Get user info from Google
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = await client.get(user_info_url, headers=headers)
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        user_info = user_response.json()
        
        # Check if user exists in our database
        existing_user = db.users.find_one({"email": user_info["email"]})
        if not existing_user:
            # Create new user
            db.users.insert_one({
                "_id": user_info["id"],
                "email": user_info["email"],
                "name": user_info.get("name", ""),
                "picture": user_info.get("picture", ""),
                "provider": "google",
                "created_at": datetime.utcnow()
            })
        
        return {
            "message": "Google OAuth successful",
            "user": {
                "id": user_info["id"],
                "email": user_info["email"],
                "name": user_info.get("name", ""),
                "picture": user_info.get("picture", "")
            },
            "access_token": access_token
        }

@router.get("/auth/github")
async def github_oauth():
    """Initiate GitHub OAuth flow"""
    github_client_id = os.getenv("GITHUB_CLIENT_ID")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:3000/auth/callback")
    
    if not github_client_id:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    auth_url = (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={github_client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"scope=user:email"
    )
    
    return {"auth_url": auth_url}

@router.post("/auth/github/callback")
async def github_callback(request: Request):
    """Handle GitHub OAuth callback"""
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not provided")
    
    github_client_id = os.getenv("GITHUB_CLIENT_ID")
    github_client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:3000/auth/callback")
    
    if not all([github_client_id, github_client_secret]):
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    # Exchange code for tokens
    token_url = "https://github.com/login/oauth/access_token"
    token_data = {
        "client_id": github_client_id,
        "client_secret": github_client_secret,
        "code": code,
        "redirect_uri": redirect_uri
    }
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            token_url, 
            data=token_data,
            headers={"Accept": "application/json"}
        )
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange code for token")
        
        tokens = token_response.json()
        access_token = tokens["access_token"]
        
        # Get user info from GitHub
        user_info_url = "https://api.github.com/user"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = await client.get(user_info_url, headers=headers)
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        user_info = user_response.json()
        
        # Get user email (GitHub requires separate API call)
        email_response = await client.get("https://api.github.com/user/emails", headers=headers)
        emails = email_response.json() if email_response.status_code == 200 else []
        primary_email = next((email["email"] for email in emails if email["primary"]), user_info.get("email", ""))
        
        # Check if user exists in our database
        existing_user = db.users.find_one({"email": primary_email})
        if not existing_user:
            # Create new user
            db.users.insert_one({
                "_id": str(user_info["id"]),
                "email": primary_email,
                "name": user_info.get("name", user_info.get("login", "")),
                "picture": user_info.get("avatar_url", ""),
                "provider": "github",
                "created_at": datetime.utcnow()
            })
        
        return {
            "message": "GitHub OAuth successful",
            "user": {
                "id": user_info["id"],
                "email": primary_email,
                "name": user_info.get("name", user_info.get("login", "")),
                "picture": user_info.get("avatar_url", "")
            },
            "access_token": access_token
        }