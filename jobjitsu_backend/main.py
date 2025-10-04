from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
print(f"MONGO_URI loaded: {os.getenv('MONGO_URI')}")
print(f"DB_NAME loaded: {os.getenv('DB_NAME')}")

app = FastAPI(
    title="JobJitsu API",
    description="Backend API for JobJitsu interview practice platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 

# Include routers
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(session.router, prefix="/api", tags=["Sessions"])

@app.get("/")
async def root():
    return {"message": "JobJitsu API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
