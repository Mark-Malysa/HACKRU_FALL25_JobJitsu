#!/usr/bin/env python3
"""
Test script for OAuth endpoints
This script tests the OAuth functionality without affecting the frontend.
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://localhost:8000/api"

def test_health():
    """Test if the API is running"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_google_oauth_initiation():
    """Test Google OAuth initiation"""
    try:
        response = requests.get(f"{BASE_URL}/auth/google")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Google OAuth initiation: {data.get('auth_url', 'No auth URL')[:50]}...")
            return True
        else:
            print(f"❌ Google OAuth initiation failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Google OAuth initiation error: {e}")
        return False

def test_github_oauth_initiation():
    """Test GitHub OAuth initiation"""
    try:
        response = requests.get(f"{BASE_URL}/auth/github")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GitHub OAuth initiation: {data.get('auth_url', 'No auth URL')[:50]}...")
            return True
        else:
            print(f"❌ GitHub OAuth initiation failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ GitHub OAuth initiation error: {e}")
        return False

def test_signup():
    """Test email/password signup"""
    try:
        test_email = "test@example.com"
        test_password = "testpassword123"
        
        response = requests.post(
            f"{BASE_URL}/auth/signup",
            params={"email": test_email, "password": test_password}
        )
        
        if response.status_code == 200:
            print(f"✅ Signup successful: {response.json()}")
            return True
        else:
            print(f"❌ Signup failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return False

def test_login():
    """Test email/password login"""
    try:
        test_email = "test@example.com"
        test_password = "testpassword123"
        
        response = requests.post(
            f"{BASE_URL}/auth/login",
            params={"email": test_email, "password": test_password}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful: {data.get('message')}")
            return data.get('token')
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_token_verification(token):
    """Test token verification"""
    if not token:
        print("❌ No token provided for verification")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/auth/verify", headers=headers)
        
        if response.status_code == 200:
            print(f"✅ Token verification successful: {response.json()}")
            return True
        else:
            print(f"❌ Token verification failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Token verification error: {e}")
        return False

def main():
    """Run all OAuth tests"""
    print("🚀 Starting OAuth API Tests")
    print("=" * 50)
    
    # Test API health
    if not test_health():
        print("\n❌ API is not running. Please start the server with: python main.py")
        return
    
    print("\n🔐 Testing Authentication Endpoints")
    print("-" * 30)
    
    # Test OAuth initiation
    test_google_oauth_initiation()
    test_github_oauth_initiation()
    
    # Test email/password auth
    test_signup()
    token = test_login()
    test_token_verification(token)
    
    print("\n" + "=" * 50)
    print("🎉 OAuth tests completed!")
    print("\nNext steps:")
    print("1. Configure OAuth provider credentials in .env")
    print("2. Test OAuth callbacks with real providers")
    print("3. Integrate with frontend authentication flow")

if __name__ == "__main__":
    main()
