import google.generativeai as genai
import os
import re

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_questions(role: str, company: str):
    prompt = f"""
        You are a friendly recruiter representing the company "{company}" for the role "{role}".
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

    model = genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)
    return response.text

def generate_followup(qa_history: list):
    joined = "\n".join([f"Q: {q}\nA: {a}" for q, a in qa_history])
    prompt = f"Given this interview exchange:\n{joined}\nGenerate one follow-up question."
    model = genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)
    return response.text.strip()

def generate_feedback(qa_history: list):
    joined = "\n".join([f"Q: {q}\nA: {a}" for q, a in qa_history])
    prompt = f"""
    Based on this mock interview, provide:
    - A numerical score (1–10)
    - Constructive feedback: what went well, what to improve.
    {joined}
    """
    model = genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)
    return response.text.strip()

def extract_score(feedback_text: str):
    match = re.search(r"(\d+)", feedback_text)
    return int(match.group(1)) if match else None