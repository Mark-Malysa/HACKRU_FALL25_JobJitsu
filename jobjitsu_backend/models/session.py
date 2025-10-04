from datetime import datetime

def session_schema():
    return {
        "user_id": None,
        "role": None,
        "company": None,
        "questions": [],
        "answers": [],
        "follow_up": None,
        "feedback": None,
        "score": None,
        "created_at": datetime.utcnow()
    }