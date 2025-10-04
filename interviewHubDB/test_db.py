#!/usr/bin/env python3
"""
Test script for Interview Hub Database
This script tests all database functions to ensure proper connection and functionality.
"""

from db_service import (
    create_user, get_user, create_session, get_session, 
    get_next_question, save_answer, save_feedback, 
    get_user_sessions, update_question_feedback
)
from datetime import datetime
import sys

def test_database_connection():
    """Test basic database connection."""
    print("🔍 Testing database connection...")
    try:
        from db_service import client
        # Test connection by pinging the database
        client.admin.command('ping')
        print("✅ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_user_operations():
    """Test user creation and retrieval."""
    print("\n👤 Testing user operations...")
    try:
        # Create a test user
        user_id = create_user("Test User", "test@rutgers.edu")
        print(f"✅ User created with ID: {user_id}")
        
        # Retrieve the user
        user = get_user(user_id)
        if user:
            print(f"✅ User retrieved: {user['name']} ({user['email']})")
            return user_id
        else:
            print("❌ Failed to retrieve user")
            return None
    except Exception as e:
        print(f"❌ User operations failed: {e}")
        return None

def test_session_operations(user_id):
    """Test session creation and management."""
    print("\n📝 Testing session operations...")
    try:
        # Create sample questions
        questions = [
            {"index": 1, "text": "Tell me about yourself.", "answer": None, "feedback": {}},
            {"index": 2, "text": "Describe a challenge you faced.", "answer": None, "feedback": {}},
            {"index": 3, "text": "Why this company?", "answer": None, "feedback": {}}
        ]
        
        # Create a session
        session_id = create_session(user_id, "Software Engineer Intern", "Google", questions)
        print(f"✅ Session created with ID: {session_id}")
        
        # Retrieve the session
        session = get_session(session_id)
        if session:
            print(f"✅ Session retrieved: {session['role']} at {session['company']}")
            print(f"   Status: {session['status']}")
            print(f"   Questions: {len(session['questions'])}")
            return session_id
        else:
            print("❌ Failed to retrieve session")
            return None
    except Exception as e:
        print(f"❌ Session operations failed: {e}")
        return None

def test_question_flow(session_id):
    """Test question answering flow."""
    print("\n❓ Testing question flow...")
    try:
        # Get first question
        question = get_next_question(session_id)
        if question:
            print(f"✅ Next question: {question['text']}")
            
            # Answer the question
            answer = "I am a computer science student with experience in Python and web development."
            save_answer(session_id, question['index'], answer)
            print(f"✅ Answer saved for question {question['index']}")
            
            # Add feedback for the question
            feedback = {
                "score": 8,
                "strengths": ["Clear communication", "Relevant experience"],
                "improvements": ["Could provide more specific examples"],
                "comment": "Good start, but needs more detail."
            }
            update_question_feedback(session_id, question['index'], feedback)
            print(f"✅ Feedback saved for question {question['index']}")
            
            return True
        else:
            print("❌ No questions found")
            return False
    except Exception as e:
        print(f"❌ Question flow failed: {e}")
        return False

def test_session_completion(session_id):
    """Test session completion with feedback."""
    print("\n🏁 Testing session completion...")
    try:
        # Complete the session with summary feedback
        summary_feedback = {
            "score": 7.5,
            "strengths": ["Good communication", "Relevant background"],
            "improvements": ["Need more specific examples", "Practice STAR method"],
            "comment": "Overall good performance, but could benefit from more structured responses."
        }
        
        save_feedback(session_id, summary_feedback)
        print("✅ Session completed with feedback")
        
        # Verify session is marked as completed
        session = get_session(session_id)
        if session and session['status'] == 'completed':
            print(f"✅ Session status: {session['status']}")
            print(f"   Final score: {session['summary']['score']}")
            return True
        else:
            print("❌ Session not properly completed")
            return False
    except Exception as e:
        print(f"❌ Session completion failed: {e}")
        return False

def test_user_sessions(user_id):
    """Test retrieving user sessions."""
    print("\n📊 Testing user sessions retrieval...")
    try:
        sessions = get_user_sessions(user_id)
        print(f"✅ Found {len(sessions)} sessions for user")
        
        for i, session in enumerate(sessions):
            print(f"   Session {i+1}: {session['role']} at {session['company']} ({session['status']})")
        
        return True
    except Exception as e:
        print(f"❌ User sessions retrieval failed: {e}")
        return False

def main():
    """Run all database tests."""
    print("🚀 Starting Interview Hub Database Tests")
    print("=" * 50)
    
    # Test database connection
    if not test_database_connection():
        print("\n❌ Database connection failed. Please check your MongoDB Atlas settings.")
        sys.exit(1)
    
    # Test user operations
    user_id = test_user_operations()
    if not user_id:
        print("\n❌ User operations failed. Exiting.")
        sys.exit(1)
    
    # Test session operations
    session_id = test_session_operations(user_id)
    if not session_id:
        print("\n❌ Session operations failed. Exiting.")
        sys.exit(1)
    
    # Test question flow
    if not test_question_flow(session_id):
        print("\n❌ Question flow failed. Exiting.")
        sys.exit(1)
    
    # Test session completion
    if not test_session_completion(session_id):
        print("\n❌ Session completion failed. Exiting.")
        sys.exit(1)
    
    # Test user sessions retrieval
    if not test_user_sessions(user_id):
        print("\n❌ User sessions retrieval failed. Exiting.")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("🎉 All database tests passed successfully!")
    print("✅ Your MongoDB database is ready for the Interview Hub application!")
    print("\nNext steps:")
    print("1. Verify data appears in MongoDB Atlas")
    print("2. Share the db_service.py with your team")
    print("3. Integrate with FastAPI backend")

if __name__ == "__main__":
    main()
