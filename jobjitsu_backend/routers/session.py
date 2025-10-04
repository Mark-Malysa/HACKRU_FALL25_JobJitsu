from fastapi import APIRouter, Depends, HTTPException
from services.auth_guard import get_current_user
from ...interviewHubDB.db_service import get_collection
from services.gemini_service import generate_questions, generate_followup, generate_feedback, extract_score
from models.session import session_schema
from datetime import datetime

router = APIRouter()
sessions = get_collection("sessions")

@router.post("/session/start")
def start_session(role: str, company: str, current_user=Depends(get_current_user)):
    user_id = current_user["user"]["id"]
    new_session = session_schema()
    new_session.update({
        "user_id": user_id,
        "role": role,
        "company": company,
        "created_at": datetime.utcnow()
    })

    new_session["questions"] = generate_questions(role, company)
    sessions.insert_one(new_session)

    return {"message": "Session started", "questions": new_session["questions"]}

@router.post("/session/answer")
def submit_answer(session_id: str, question: str, answer: str):
    session = sessions.find_one({"_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session["answers"].append({"question": question, "answer": answer})
    sessions.update_one({"_id": session_id}, {"$set": {"answers": session["answers"]}})

    return {"message": "Answer saved"}

@router.post("/session/followup")
def followup(session_id: str):
    session = sessions.find_one({"_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    qa_pairs = [(qa["question"], qa["answer"]) for qa in session["answers"]]
    followup = generate_followup(qa_pairs)
    sessions.update_one({"_id": session_id}, {"$set": {"follow_up": followup}})
    return {"follow_up": followup}

@router.post("/session/feedback")
def feedback(session_id: str):
    session = sessions.find_one({"_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    qa_pairs = [(qa["question"], qa["answer"]) for qa in session["answers"]]
    feedback_text = generate_feedback(qa_pairs)

    sessions.update_one(
        {"_id": session_id},
        {"$set": {"feedback": feedback_text, "score": extract_score(feedback_text)}}
    )

    return {"feedback": feedback_text}