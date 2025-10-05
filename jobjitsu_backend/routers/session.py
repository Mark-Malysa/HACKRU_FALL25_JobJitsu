import base64
import json
import re
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

    print(f"Current user object: {current_user}")
    print(f"Current user type: {type(current_user)}")
    print(f"Current user attributes: {dir(current_user) if hasattr(current_user, '__dict__') else 'No attributes'}")

    # Try different ways to get the user ID
    user_id = None
    if hasattr(current_user, 'user') and hasattr(current_user.user, 'id'):
        user_id = current_user.user.id
        print(f"Found user ID via current_user.user.id: {user_id}")
    elif hasattr(current_user, 'id'):
        user_id = current_user.id
        print(f"Found user ID via current_user.id: {user_id}")
    elif hasattr(current_user, 'user_id'):
        user_id = current_user.user_id
        print(f"Found user ID via current_user.user_id: {user_id}")
    else:
        print("Could not find user ID in current_user object")

    new_session = session_schema()
    new_session.update({
        "user_id": user_id,
        "role": role,
        "company": company,
        "created_at": datetime.utcnow()
    })

    print(f"Session being created with user_id: {user_id}")

    try:
        questions_list = generate_questions(role, company)
        print(questions_list)
        # Convert list to the JSON structure you showed
        # questions_dict = {}
        # for i, question in enumerate(questions_list[:3], 1):  # Limit to 3 questions
        #     questions_dict[f"question{i}"] = question
        #     questions_dict[f"answer{i}"] = ""  # Initialize empty answers

        # new_session["questions"] = questions_dict
        json_match = re.search(r"\{.*\}", questions_list, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON object found in Gemini output.")

        clean_output = json_match.group(0).strip()

        # 2️⃣ Fix missing commas between key-value pairs
        # e.g. turns: "skill?"\n  "answer3" into "skill?",\n  "answer3"
        clean_output = re.sub(r'"\s*([\r\n]+)\s*"', '", "', clean_output)

        # 3️⃣ Ensure JSON keys and values are properly separated by commas
        clean_output = re.sub(r'"\s*"answer', '", "answer', clean_output)

        questions_dict = json.loads(clean_output)
        print(f"Questions dict: {questions_dict}")

        new_session["questions"] = questions_dict
        print(f"New session: {new_session}")

        # Get the first question for text-to-speech
        first_question_text = questions_dict.get('question1', "Hello, let's start the interview.")
        print(f"First question text: {first_question_text}")
        #audio_content = await text_to_speech(first_question_text)
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

    print(f"About to insert session to database: {new_session}")
    result = sessions.insert_one(new_session)
    session_id = str(result.inserted_id)
    print(f"Session inserted with ID: {session_id}")

    # Verify the session was saved correctly
    saved_session = sessions.find_one({"_id": result.inserted_id})
    print(f"Saved session user_id: {saved_session.get('user_id') if saved_session else 'Session not found'}")

    return {"message": "Session started", "session_id": session_id, "questions": new_session["questions"]}

@router.get("/session/{session_id}/next")
async def get_next_question(session_id: str):
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
                question_text = questions[question_key]
                print(f"[AUDIO DEBUG] Generating audio for question: {question_text}")
                try:
                    audio_content = await text_to_speech(question_text)
                    audio_b64 = base64.b64encode(audio_content).decode("utf-8") if audio_content else None
                    print(f"[AUDIO DEBUG] audio_b64 length: {len(audio_b64) if audio_b64 else 0}")
                except Exception as audio_err:
                    print(f"[AUDIO DEBUG] Error generating audio: {audio_err}")
                    audio_b64 = None
                return {
                    "question_number": i,
                    "question": question_text,
                    "is_last_question": i == 3,  # Assuming 3 total questions
                    "audio_b64": audio_b64
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
async def followup(session_id: str, current_user=Depends(get_current_user)):
    print(f"Follow-up request for session_id: {session_id}")
    try:
        session_object_id = ObjectId(session_id)
        print(f"Converted to ObjectId: {session_object_id}")
    except Exception as e:
        print(f"Error converting session_id to ObjectId: {e}")
        raise HTTPException(status_code=400, detail="Invalid session ID format")

    session = sessions.find_one({"_id": session_object_id})
    if session is None:
        print(f"Session not found in database for ID: {session_id}")
        raise HTTPException(status_code=404, detail="Session not found")

    print(f"Found session: {session.get('_id')}")
    print(f"Session questions: {session.get('questions', {})}")

    # Extract Q&A pairs from the questions object
    questions = session.get("questions", {})
    qa_pairs = []
    for i in range(1, 4):  # Assuming max 3 questions
        question_key = f"question{i}"
        answer_key = f"answer{i}"
        if question_key in questions and answer_key in questions:
            qa_pairs.append((questions[question_key], questions[answer_key]))

    print(f"QA pairs for followup: {qa_pairs}")
    followup_response = generate_followup(qa_pairs)
    print(f"Followup response: {followup_response}")

    # Parse the JSON response to extract just the question
    try:
        cleaned = re.sub(r"^```(?:json)?|```$", "", followup_response.strip(), flags=re.MULTILINE)

        # 2️⃣ Extract the JSON portion only, in case Gemini added extra text
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON object found in Gemini response.")
        cleaned_json = match.group(0)
        followup_data = json.loads(cleaned_json)
        followup_question = followup_data.get("followup_question", "That's interesting! Can you tell me more?")
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Error parsing followup response: {e}")
        followup_question = "That's interesting! Can you tell me more?"

     # Generate TTS audio for the follow-up question
    audio_b64 = None
    try:
        from services.elevenlabs_service import text_to_speech
        audio_content = None
        if followup_question and isinstance(followup_question, str) and len(followup_question) < 1000:
            audio_content = await text_to_speech(followup_question)
        if audio_content:
            audio_b64 = base64.b64encode(audio_content).decode("utf-8")
            print(f"[AUDIO DEBUG] Follow-up audio_b64 length: {len(audio_b64)}")
        else:
            print("[AUDIO DEBUG] No audio content generated for follow-up.")
    except Exception as audio_err:
        print(f"[AUDIO DEBUG] Error generating audio for follow-up: {audio_err}")
        audio_b64 = None

    # Store the follow-up question in the session
    print(f"Storing follow-up question: {followup_question}")
    result = sessions.update_one({"_id": session_object_id}, {"$set": {"follow_up_question": followup_question, "follow_up_answer": ""}})
    print(f"Database update result: {result.modified_count} documents modified")

    # Verify the update
    updated_session = sessions.find_one({"_id": session_object_id})
    print(f"Updated session follow-up fields: follow_up_question={updated_session.get('follow_up_question')}, follow_up_answer={updated_session.get('follow_up_answer')}")

    return {"follow_up": followup_question, "audio_b64": audio_b64}

@router.post("/session/{session_id}/followup-answer")
def submit_followup_answer(session_id: str, answer: str, current_user=Depends(get_current_user)):
    """Submit the follow-up answer"""
    try:
        print(f"Follow-up answer request for session_id: {session_id}")
        try:
            session_object_id = ObjectId(session_id)
            print(f"Converted to ObjectId: {session_object_id}")
        except Exception as e:
            print(f"Error converting session_id to ObjectId: {e}")
            raise HTTPException(status_code=400, detail="Invalid session ID format")

        session = sessions.find_one({"_id": session_object_id})
        if session is None:
            print(f"Session not found in database for ID: {session_id}")
            raise HTTPException(status_code=404, detail="Session not found")

        # Update the follow-up answer in the session
        print(f"Storing follow-up answer: {answer}")
        result = sessions.update_one(
            {"_id": session_object_id},
            {"$set": {"follow_up_answer": answer}}
        )
        print(f"Follow-up answer update result: {result.modified_count} documents modified")

        # Verify the update
        updated_session = sessions.find_one({"_id": session_object_id})
        print(f"Updated session follow-up answer: {updated_session.get('follow_up_answer')}")

        return {"message": "Follow-up answer saved"}
    except Exception as e:
        print(f"Error saving follow-up answer: {e}")
        raise HTTPException(status_code=500, detail=f"Error saving follow-up answer: {str(e)}")
    
@router.post("/session/{session_id}/feedback")

async def feedback(session_id: str, current_user=Depends(get_current_user)):
    session = sessions.find_one({"_id": ObjectId(session_id)})
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # Extract Q&A pairs from the questions object
    questions = session.get("questions", {})
    qa_pairs = []
    for i in range(1, 4):  # Assuming max 3 questions
        question_key = f"question{i}"
        answer_key = f"answer{i}"
        if question_key in questions and answer_key in questions:
            qa_pairs.append((questions[question_key], questions[answer_key]))

    # Add follow-up Q&A if it exists
    if session.get("follow_up_question") and session.get("follow_up_answer"):
        qa_pairs.append((session["follow_up_question"], session["follow_up_answer"]))

    print(f"QA pairs for feedback: {qa_pairs}")
    feedback_response = generate_feedback(qa_pairs)
    print(f"Feedback response: {feedback_response}")


    # Parse the JSON response to extract score and description (robust)
    try: 
        raw = feedback_response.strip()
        # 1) Strip markdown code fences if present
        raw = re.sub(r"^```(?:json)?\n?|```$", "", raw, flags=re.MULTILINE).strip()
        # 2) Extract first JSON object
        json_match = re.search(r"\{[\s\S]*\}", raw)
        feedback_data: dict
        if json_match:
            candidate = json_match.group(0).strip()
            try:
                feedback_data = json.loads(candidate)
            except json.JSONDecodeError:
                # 3) Sometimes the JSON is double-encoded as a string; try to unescape
                unescaped = candidate.encode('utf-8').decode('unicode_escape')
                feedback_data = json.loads(unescaped)
        else:
            # No JSON object found; fall back to score extraction
            feedback_data = {
                "score": extract_score(feedback_response) or 5,
                "description": feedback_response
            }

        # 4) If description itself still contains a JSON block, parse nested
        desc = feedback_data.get("description")
        if isinstance(desc, str):
            desc_stripped = re.sub(r"^```(?:json)?\n?|```$", "", desc, flags=re.MULTILINE).strip()
            nested_match = re.search(r"\{[\s\S]*\}", desc_stripped)
            if nested_match:
                try:
                    nested = json.loads(nested_match.group(0))
                    if isinstance(nested, dict):
                        feedback_data["description"] = nested.get("description", desc_stripped)
                        if isinstance(nested.get("score"), (int, float)):
                            feedback_data["score"] = nested["score"]
                except Exception:
                    pass

        # Normalize types
        if not isinstance(feedback_data.get("score"), (int, float)):
            extracted = extract_score(json.dumps(feedback_data))
            feedback_data["score"] = extracted or 5
        if not isinstance(feedback_data.get("description"), str):
            feedback_data["description"] = str(feedback_data.get("description", ""))

    except Exception as e:
        print(f"Error parsing feedback response (robust): {e}")
        print(f"Raw feedback response: {feedback_response}")
        feedback_data = {
            "score": extract_score(feedback_response) or 5,
            "description": feedback_response
        }

    # SKIP TTS for feedback: do not generate audio for feedback
    audio_b64 = None  # Always None, never call TTS for feedback

    # Store the parsed feedback in the session
    sessions.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"feedback": feedback_data}}
    )

    print(f"Returning feedback: description={feedback_data.get('description', 'NO DESCRIPTION')}, score={feedback_data.get('score', 'NO SCORE')}, audio_b64={'present' if audio_b64 else 'absent'}")
    print(f"Feedback data type: {type(feedback_data.get('description'))}")
    print(f"Feedback data content: {feedback_data.get('description')[:200]}...")
    return {"feedback": feedback_data["description"], "score": feedback_data["score"], "audio_b64": audio_b64}

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
    return 5.0
