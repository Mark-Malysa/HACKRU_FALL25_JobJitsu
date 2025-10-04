#!/usr/bin/env python3
"""
Example usage of the Interview Hub Database Service
This script demonstrates how to use the database functions in a real application.
"""

from db_service import (
    create_user, create_session, get_next_question, 
    save_answer, save_feedback, get_session
)

def example_interview_flow():
    """Example of a complete interview flow."""
    print("🎯 Interview Hub Database Example")
    print("=" * 40)
    
    # 1. Create a user
    print("1. Creating user...")
    user_id = create_user("John Doe", "john@rutgers.edu")
    print(f"   User created with ID: {user_id}")
    
    # 2. Create an interview session
    print("\n2. Creating interview session...")
    questions = [
        {"index": 1, "text": "Tell me about yourself.", "answer": None, "feedback": {}},
        {"index": 2, "text": "Why are you interested in this role?", "answer": None, "feedback": {}},
        {"index": 3, "text": "Describe a challenging project you worked on.", "answer": None, "feedback": {}}
    ]
    
    session_id = create_session(
        user_id=user_id,
        role="Software Engineer Intern", 
        company="TechCorp",
        q_list=questions
    )
    print(f"   Session created with ID: {session_id}")
    
    # 3. Simulate answering questions
    print("\n3. Simulating interview questions...")
    
    # Question 1
    question = get_next_question(session_id)
    print(f"   Q1: {question['text']}")
    answer1 = "I'm a computer science student with experience in Python, React, and database design. I've worked on several projects including a web application for managing study groups."
    save_answer(session_id, question['index'], answer1)
    print(f"   A1: {answer1[:50]}...")
    
    # Question 2
    question = get_next_question(session_id)
    print(f"   Q2: {question['text']}")
    answer2 = "I'm excited about this role because it combines my passion for software development with the opportunity to work on real-world problems. I'm particularly interested in the company's focus on AI and machine learning."
    save_answer(session_id, question['index'], answer2)
    print(f"   A2: {answer2[:50]}...")
    
    # Question 3
    question = get_next_question(session_id)
    print(f"   Q3: {question['text']}")
    answer3 = "I worked on a group project where we had to build a recommendation system with limited data. The challenge was implementing collaborative filtering algorithms while handling sparse data. I learned about matrix factorization and how to optimize for performance."
    save_answer(session_id, question['index'], answer3)
    print(f"   A3: {answer3[:50]}...")
    
    # 4. Complete the session with feedback
    print("\n4. Completing session with feedback...")
    feedback = {
        "score": 8.5,
        "strengths": [
            "Clear communication",
            "Relevant technical experience", 
            "Good use of specific examples",
            "Shows enthusiasm for the role"
        ],
        "improvements": [
            "Could provide more quantifiable results",
            "Consider using the STAR method more consistently"
        ],
        "comment": "Strong candidate with good technical background. Answers were well-structured and showed genuine interest in the role."
    }
    
    save_feedback(session_id, feedback)
    print("   Session completed!")
    
    # 5. Retrieve and display final session
    print("\n5. Final session summary:")
    session = get_session(session_id)
    print(f"   Role: {session['role']} at {session['company']}")
    print(f"   Status: {session['status']}")
    print(f"   Score: {session['summary']['score']}/10")
    print(f"   Strengths: {', '.join(session['summary']['strengths'])}")
    print(f"   Improvements: {', '.join(session['summary']['improvements'])}")
    
    print("\n✅ Example completed successfully!")
    print("   Check MongoDB Atlas to see the data in your database.")

if __name__ == "__main__":
    example_interview_flow()
