from fastapi import FastAPI
from routers import auth, sessions

app = FastAPI(title="InterviewHub API")

app.include_router(auth.router)
app.include_router(sessions.router)

@app.get("/")
def root():
    return {"message": "InterviewHub Backend Running!"}