import google.generativeai as genai
import os
import re

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_questions(role: str, company: str):
    prompt = f"You are a recruiter for the role {role} for company {company}. Give me 3 questions that they would ask at a career fair, not at an interview, but do it in a way that sounds like a recruiter talking at a career fair. I also need you to put it only in json format, with no other text outside of it. For example: {{\"questions\": {{  \n   \"question1\": \"Hi, my name is Bob! Tell me about yourself?\", \"answer1\": \"\",  \n   \"question2\": \"...\", \"answer2\": \"\",  \n   \"question3\": \"...\", \"answer3\": \"\"}}}}"
    model = genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)
    return response.text.split("\n")

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