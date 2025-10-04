#!/usr/bin/env python3
"""
Simple test to verify OAuth endpoints work without database
"""

import requests
import json

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

def main():
    """Run OAuth tests"""
    print("🚀 Starting Simple OAuth API Tests")
    print("=" * 50)
    
    # Test API health
    if not test_health():
        print("\n❌ API is not running. Please start the server with: python main.py")
        return
    
    print("\n🔐 Testing OAuth Initiation Endpoints")
    print("-" * 30)
    
    # Test OAuth initiation
    test_google_oauth_initiation()
    test_github_oauth_initiation()
    
    print("\n" + "=" * 50)
    print("🎉 OAuth initiation tests completed!")
    print("\nNote: Full OAuth testing requires proper environment configuration.")

if __name__ == "__main__":
    main()
