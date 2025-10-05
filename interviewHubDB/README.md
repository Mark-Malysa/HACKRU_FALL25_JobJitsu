# Interview Hub Database

This directory contains the MongoDB database setup and service functions for the Interview Hub application.

## Setup

1. **Virtual Environment**: Already set up with `venv/`
2. **Dependencies**: Install with `pip install -r requirements.txt`
3. **Environment Variables**: `.env` file contains MongoDB connection string

## Files

- `db_service.py` - Main database service with all helper functions
- `test_db.py` - Comprehensive test script to verify database functionality
- `.env` - Environment variables (MongoDB connection string)
- `requirements.txt` - Python dependencies

## Database Schema

### Collections

1. **users** - Store user information
   ```json
   {
     "_id": "ObjectId",
     "name": "string",
     "email": "string", 
     "created_at": "datetime"
   }
   ```

2. **sessions** - Store interview sessions
   ```json
   {
     "_id": "ObjectId",
     "user_id": "string",
     "type": "recruiter_convo",
     "role": "string",
     "company": "string",
     "status": "active|completed",
     "questions": [
       {
         "index": "number",
         "text": "string",
         "answer": "string|null",
         "feedback": "object"
       }
     ],
     "follow_up": {
       "question": "string|null",
       "answer": "string|null",
       "feedback": "object"
     },
     "summary": {
       "score": "number|null",
       "strengths": "array",
       "improvements": "array", 
       "comment": "string|null"
     },
     "created_at": "datetime",
     "completed_at": "datetime|null"
   }
   ```

## Available Functions

### User Management
- `create_user(name, email)` - Create a new user
- `get_user(user_id)` - Get user by ID

### Session Management  
- `create_session(user_id, role, company, q_list)` - Create new interview session
- `get_session(session_id)` - Get session by ID
- `get_user_sessions(user_id)` - Get all sessions for a user

### Question Flow
- `get_next_question(session_id)` - Get next unanswered question
- `save_answer(session_id, index, answer)` - Save user's answer
- `update_question_feedback(session_id, index, feedback)` - Add feedback to question

### Session Completion
- `save_followup(session_id, question, answer)` - Save follow-up Q&A
- `save_feedback(session_id, feedback)` - Complete session with summary

### Utility Functions
- `get_active_sessions()` - Get all active sessions
- `get_completed_sessions()` - Get all completed sessions

## Testing

Run the test script to verify everything works:

```bash
source venv/bin/activate
python test_db.py
```

## Integration

The `db_service.py` file can be imported by your FastAPI backend:

```python
from db_service import create_session, get_next_question, save_answer
```

## MongoDB Atlas

- **Cluster**: InterviewHubCluster
- **Database**: interviewhub
- **Collections**: users, sessions
- **Connection**: Configured in `.env` file
