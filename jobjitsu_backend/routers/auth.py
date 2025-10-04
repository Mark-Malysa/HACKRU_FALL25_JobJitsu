from fastapi import APIRouter, HTTPException, Header
from services.auth_service import signup_user, login_user, verify_token
from ...interviewHubDB.db_service import db
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