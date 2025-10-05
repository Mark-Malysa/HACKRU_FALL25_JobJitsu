from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client with error handling
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    print("Warning: Supabase credentials not found. OAuth will not work without proper configuration.")
    supabase = None
else:
    supabase = create_client(supabase_url, supabase_key)

def signup_user(email: str, password: str):
    if not supabase:
        return {"error": "Supabase not configured"}
    print(f"Signing up user with email: {email}")
    response = supabase.auth.sign_up({"email": email, "password": password})
    print(f"response received.")
    return response

def login_user(email: str, password: str):
    if not supabase:
        return {"error": "Supabase not configured"}
    response = supabase.auth.sign_in_with_password({"email": email, "password": password})
    return response

def verify_token(token: str):
    if not supabase:
        return None
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception:
        return None