import google.generativeai as genai
import os
import re

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_questions(role: str, company: str):
    prompt = f"""
        You are a friendly recruiter, with a womens name, representing the company "{company}" for the role "{role}".
        You are chatting with a student at a career fair — this is a casual, conversational exchange,
        not a formal interview.

        Generate exactly 3 realistic questions that a recruiter might ask during this kind of casual
        career fair conversation. Keep the tone warm, natural, and engaging.

        Respond **only** in valid JSON format. Do not include any text, comments, or explanations outside of the JSON.

        The JSON must follow this exact structure:

        {{
        "question1": "Hi, my name is Bob! Tell me about yourself?",
        "answer1": "",
        "question2": "What interests you most about our company?",
        "answer2": "",
        "question3": "Are you currently working on any projects related to this field?",
        "answer3": ""
        }}
    """

    model = genai.GenerativeModel("gemini-2.0-flash-001")
    response = model.generate_content(prompt)
    return response.text

def generate_followup(qa_history: list):
    joined = "\n".join([f"Q: {q}\nA: {a}" for q, a in qa_history])
    prompt = f"""
    You are a friendly recruiter continuing a casual conversation with a student at a career fair.
    Here is the exchange so far:

    {joined}

    Based on their most recent answers, ask ONE short, natural, and engaging follow-up question
    that builds on what they just said. Avoid repeating or rephrasing previous questions,
    and keep it conversational, like you're chatting at your company's booth — not a formal interview.

    Respond ONLY in valid JSON format (no extra text or explanations).
    Follow this exact structure:

    {{
      "followup_question": "That’s awesome! What inspired you to start that project?",
      "followup_answer": ""
    }}
    """
    model = genai.GenerativeModel("gemini-2.0-flash-001")
    response = model.generate_content(prompt)
    return response.text.strip()

def generate_feedback(qa_history: list):
    joined = "\n".join([f"Q: {q}\nA: {a}" for q, a in qa_history])
    prompt = f"""Based on this mock interview, provide:
    - A numerical score (1–10)
    - Constructive feedback: what went well, what to improve.
    {joined} 
    put it in this json format:
    "score": integer, "description": "<description>"
    Make sure the description is formatted so it gives overall feedback and then a breakdown of each question and answer
    """
    model = genai.GenerativeModel("gemini-2.0-flash-001")
    response = model.generate_content(prompt)
    return response.text.strip()

def extract_score(feedback_text: str):
    match = re.search(r"(\d+)", feedback_text)
    return int(match.group(1)) if match else None