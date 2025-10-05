import json
from fastapi import APIRouter, Depends, HTTPException
from flask_login import current_user
from services.elevenlabs_service import text_to_speech
from services.auth_guard import get_current_user
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from interviewHubDB.db_service import db
from services.gemini_service import generate_questions, generate_followup, generate_feedback
from models.session import session_schema
from datetime import datetime
from bson import ObjectId
import re

router = APIRouter()
sessions = db.sessions if db is not None else None

@router.post("/session/start")
async def start_session(role: str, company: str, current_user=Depends(get_current_user)):
    print(f"Starting session for user: {current_user}")
    if sessions is None:
        raise HTTPException(status_code=500, detail="Database not configured")

    user_id = getattr(current_user, "id", None)
    new_session = session_schema()
    new_session.update({
        "user_id": user_id,
        "role": role,
        "company": company,
        "created_at": datetime.utcnow()
    })

    questions = generate_questions(role, company)
    new_session["questions"] = json.loads(questions)
    first_question_text = questions[0]["question1"]
    audio_content = await text_to_speech(first_question_text)

    result = sessions.insert_one(new_session)
    session_id = str(result.inserted_id)

    return {"message": "Session started", "session_id": session_id, "questions": questions}

@router.post("/session/answer")
def submit_answer(session_id: str, question: str, answer: str):
    session = sessions.find_one({"_id": ObjectId(session_id)})
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    session["answers"].append({"question": question, "answer": answer})
    sessions.update_one({"_id": ObjectId(session_id)}, {"$set": {"answers": session["answers"]}})

    return {"message": "Answer saved"}

@router.post("/session/followup")
def followup(session_id: str):
    session = sessions.find_one({"_id": ObjectId(session_id)})
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    qa_pairs = [(qa["question"], qa["answer"]) for qa in session["answers"]]
    followup = generate_followup(qa_pairs)
    sessions.update_one({"_id": ObjectId(session_id)}, {"$set": {"follow_up": followup}})
    return {"follow_up": followup}

@router.post("/session/feedback")
def feedback(session_id: str):
    session = sessions.find_one({"_id": ObjectId(session_id)})
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    qa_pairs = [(qa["question"], qa["answer"]) for qa in session["answers"]]
    feedback_text = generate_feedback(qa_pairs)

    sessions.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"feedback": feedback_text, "score": extract_score(feedback_text)}}
    )

    return {"feedback": feedback_text}

def extract_score(feedback_text: str) -> float:
    """Extract numerical score from feedback text"""
    # Look for patterns like "8.5/10", "Score: 7", etc.
    score_patterns = [
        r'(\d+(?:\.\d+)?)/10',
        r'Score:\s*(\d+(?:\.\d+)?)',
        r'score[:\s]*(\d+(?:\.\d+)?)',
        r'(\d+(?:\.\d+)?)\s*out\s*of\s*10'
    ]
    
    for pattern in score_patterns:
        match = re.search(pattern, feedback_text, re.IGNORECASE)
        if match:
            return float(match.group(1))
    
    # Default score if no pattern found
    return 7.0