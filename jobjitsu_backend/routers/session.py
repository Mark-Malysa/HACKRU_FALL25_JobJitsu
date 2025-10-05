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

    try:
        questions_list = generate_questions(role, company)
        print(questions_list)
        # Convert list to the JSON structure you showed
        # questions_dict = {}
        # for i, question in enumerate(questions_list[:3], 1):  # Limit to 3 questions
        #     questions_dict[f"question{i}"] = question
        #     questions_dict[f"answer{i}"] = ""  # Initialize empty answers
        
        # new_session["questions"] = questions_dict

        questions_dict = json.loads(questions_list)
        new_session["questions"] = questions_dict
        
        # Get the first question for text-to-speech
        first_question_text = questions_dict[0]['question1'] if questions_dict[0] else "Hello, let's start the interview."
        audio_content = await text_to_speech(first_question_text)
    except Exception as e:
        print(f"Error generating questions or audio: {e}")
        # Fallback to mock questions if Gemini fails
        questions_dict = {
            "question1": f"Tell me about yourself and why you're interested in the {role} position at {company}.",
            "answer1": "",
            "question2": f"What experience do you have with the technologies commonly used in {role} roles?",
            "answer2": "",
            "question3": f"How would you approach solving a complex problem in your role as a {role}?",
            "answer3": ""
        }
        new_session["questions"] = questions_dict
        audio_content = None

    result = sessions.insert_one(new_session)
    session_id = str(result.inserted_id)

    return {"message": "Session started", "session_id": session_id, "questions": new_session["questions"]}

@router.get("/session/{session_id}/next")
def get_next_question(session_id: str):
    """Get the next unanswered question from the session"""
    try:
        session = sessions.find_one({"_id": ObjectId(session_id)})
        if session is None:
            raise HTTPException(status_code=404, detail="Session not found")
        
        questions = session.get("questions", {})
        
        # Find the first question without an answer
        for i in range(1, 4):  # Assuming max 3 questions based on your structure
            question_key = f"question{i}"
            answer_key = f"answer{i}"
            
            if question_key in questions and questions.get(answer_key, "").strip() == "":
                return {
                    "question_number": i,
                    "question": questions[question_key],
                    "is_last_question": i == 3  # Assuming 3 total questions
                }
        
        # If all questions are answered
        return {
            "message": "All questions completed",
            "is_complete": True
        }
        
    except Exception as e:
        print(f"Error getting next question: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving next question: {str(e)}")

@router.post("/session/{session_id}/answer")
def submit_answer(session_id: str, question_number: int, answer: str):
    """Submit an answer for a specific question number"""
    try:
        session = sessions.find_one({"_id": ObjectId(session_id)})
        if session is None:
            raise HTTPException(status_code=404, detail="Session not found")

        # Update the specific answer in the questions structure
        answer_key = f"answer{question_number}"
        sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": {f"questions.{answer_key}": answer}}
        )

        return {"message": "Answer saved"}
    except Exception as e:
        print(f"Error saving answer: {e}")
        raise HTTPException(status_code=500, detail=f"Error saving answer: {str(e)}")

@router.post("/session/{session_id}/followup")
def followup(session_id: str):
    session = sessions.find_one({"_id": ObjectId(session_id)})
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    qa_pairs = [(qa["question"], qa["answer"]) for qa in session["answers"]]
    followup = generate_followup(qa_pairs)
    sessions.update_one({"_id": ObjectId(session_id)}, {"$set": {"follow_up": followup}})
    return {"follow_up": followup}

@router.post("/session/{session_id}/feedback")
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