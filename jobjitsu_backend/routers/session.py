from fastapi import FastAPI
from ...interviewHubDB import db_service

app = FastAPI()

@app.post("/session/start")
async def start_session(role, company):
    questions = gemini_service.generate_questions(role, company)
    session = db_service.create_session(questions)
    return {"session_id":session.id, "questions": questions}

