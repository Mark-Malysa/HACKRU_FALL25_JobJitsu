from supabase import create_client
import os

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

def signup_user(email: str, password: str):
    response = supabase.auth.sign_up({"email": email, "password": password})
    return response

def login_user(email: str, password: str):
    response = supabase.auth.sign_in_with_password({"email": email, "password": password})
    return response

def verify_token(token: str):
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception:
        return None