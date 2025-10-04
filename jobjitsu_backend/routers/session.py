from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/session/start")
async def start_session(role, company):
    questions = gemini_service.generate_questions(role, company)
    session = db_service.create_session(questions)
    return {"session_id":session.id, "questions": questions}

