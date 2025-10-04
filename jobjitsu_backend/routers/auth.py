from fastapi import APIRouter, HTTPException, Header
from services.auth_service import signup_user, login_user, verify_token

router = APIRouter()

@router.post("/auth/signup")
def signup(email: str, password: str):
    result = signup_user(email, password)
    if not result or result.get("error"):
        raise HTTPException(status_code=400, detail="Signup failed")
    return {"message": "Signup successful", "user": result}

@router.post("/auth/login")
def login(email: str, password: str):
    result = login_user(email, password)
    if not result or result.get("error"):
        raise HTTPException(status_code=401, detail="Login failed")
    token = result.session.access_token
    return {"token": token}

@router.get("/auth/verify")
def verify(authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "Token valid", "user": user}