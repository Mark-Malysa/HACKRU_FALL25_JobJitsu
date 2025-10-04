from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]

def create_session(user_id, role, company, q_list):
    """
    Create a new interview session.
    
    Args:
        user_id (str): ID of the user starting the session
        role (str): Job role being interviewed for
        company (str): Company name
        q_list (list): List of questions for the session
    
    Returns:
        str: The ID of the created session
    """
    session = {
        "user_id": user_id,
        "type": "recruiter_convo",
        "role": role,
        "company": company,
        "status": "active",
        "questions": q_list,
        "follow_up": {"question": None, "answer": None, "feedback": {}},
        "summary": {"score": None, "strengths": [], "improvements": [], "comment": None},
        "created_at": datetime.utcnow(),
        "completed_at": None
    }
    result = db.sessions.insert_one(session)
    return str(result.inserted_id)

def get_next_question(session_id):
    """
    Get the next unanswered question in a session.
    
    Args:
        session_id (str): ID of the session
    
    Returns:
        dict or None: The next unanswered question, or None if all questions are answered
    """
    session = db.sessions.find_one({"_id": ObjectId(session_id)})
    if not session:
        return None
    
    for q in session["questions"]:
        if q["answer"] is None:
            return q
    return None

def save_answer(session_id, index, answer):
    """
    Save a user's answer to a specific question.
    
    Args:
        session_id (str): ID of the session
        index (int): Index of the question being answered
        answer (str): User's answer
    """
    db.sessions.update_one(
        {"_id": ObjectId(session_id), "questions.index": index},
        {"$set": {"questions.$.answer": answer}}
    )

def save_followup(session_id, question, answer):
    """
    Save a follow-up question and answer.
    
    Args:
        session_id (str): ID of the session
        question (str): Follow-up question
        answer (str): User's answer to follow-up
    """
    db.sessions.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"follow_up": {"question": question, "answer": answer}}}
    )

def save_feedback(session_id, feedback):
    """
    Save feedback and mark session as completed.
    
    Args:
        session_id (str): ID of the session
        feedback (dict): Feedback containing score, strengths, improvements, and comment
    """
    db.sessions.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"summary": feedback, "status": "completed", "completed_at": datetime.utcnow()}}
    )

def get_session(session_id):
    """
    Get a complete session by ID.
    
    Args:
        session_id (str): ID of the session
    
    Returns:
        dict or None: The session data, or None if not found
    """
    return db.sessions.find_one({"_id": ObjectId(session_id)})

def get_user_sessions(user_id):
    """
    Get all sessions for a specific user.
    
    Args:
        user_id (str): ID of the user
    
    Returns:
        list: List of sessions for the user
    """
    return list(db.sessions.find({"user_id": user_id}))

def create_user(name, email):
    """
    Create a new user.
    
    Args:
        name (str): User's name
        email (str): User's email
    
    Returns:
        str: The ID of the created user
    """
    user = {
        "name": name,
        "email": email,
        "created_at": datetime.utcnow()
    }
    result = db.users.insert_one(user)
    return str(result.inserted_id)

def get_user(user_id):
    """
    Get user information by ID.
    
    Args:
        user_id (str): ID of the user
    
    Returns:
        dict or None: User data, or None if not found
    """
    return db.users.find_one({"_id": ObjectId(user_id)})

def update_question_feedback(session_id, question_index, feedback):
    """
    Update feedback for a specific question.
    
    Args:
        session_id (str): ID of the session
        question_index (int): Index of the question
        feedback (dict): Feedback for the question
    """
    db.sessions.update_one(
        {"_id": ObjectId(session_id), "questions.index": question_index},
        {"$set": {"questions.$.feedback": feedback}}
    )

def get_active_sessions():
    """
    Get all active sessions.
    
    Returns:
        list: List of active sessions
    """
    return list(db.sessions.find({"status": "active"}))

def get_completed_sessions():
    """
    Get all completed sessions.
    
    Returns:
        list: List of completed sessions
    """
    return list(db.sessions.find({"status": "completed"}))
