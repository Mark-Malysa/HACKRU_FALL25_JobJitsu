import google.generativeai as genai
import os
import re

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_questions(role: str, company: str):
    prompt = f"Generate 3 recruiter-style interview questions for a {role} at {company}."
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text.split("\n")

def generate_followup(qa_history: list):
    joined = "\n".join([f"Q: {q}\nA: {a}" for q, a in qa_history])
    prompt = f"Given this interview exchange:\n{joined}\nGenerate one follow-up question."
    model = genai.GenerativeModel("gemini-pro")
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
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text.strip()

def extract_score(feedback_text: str):
    match = re.search(r"(\d+)", feedback_text)
    return int(match.group(1)) if match else None