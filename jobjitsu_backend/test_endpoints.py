import requests

BASE_URL = "http://localhost:8000/api"
email = "hartk2006@gmail.com"      # Use your desired test email
password = "testpassword"       # Use your desired test password

response = requests.post(f"{BASE_URL}/auth/signup", params={"email": email, "password": password})
print(response.status_code, response.text)

TEST_EMAIL = "test@example.com"  # Change as needed
TEST_PASSWORD = "testpassword"    # Change as needed

def get_token():
    data = {"email": TEST_EMAIL, "password": TEST_PASSWORD}
    response = requests.post(f"{BASE_URL}/auth/login", params=data)
    try:
        resp_json = response.json()
    except Exception:
        print("Login: Response not JSON:", response.status_code, response.text)
        return None
    print("Login:", response.status_code, resp_json)
    return resp_json.get("token")

def test_start_session(token):
    data = {"role": "Software Engineer", "company": "Google"}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/session/start", params=data, headers=headers)
    try:
        resp_json = response.json()
    except Exception:
        print("Start Session: Response not JSON:", response.status_code, response.text)
        return {}
    print("Start Session:", response.status_code, resp_json)
    return resp_json

def test_submit_answer(token, session_id, question, answer):
    data = {"session_id": session_id, "question": question, "answer": answer}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/session/answer", params=data, headers=headers)
    try:
        resp_json = response.json()
    except Exception:
        print("Submit Answer: Response not JSON:", response.status_code, response.text)
        return {}
    print("Submit Answer:", response.status_code, resp_json)
    return resp_json

def test_followup(token, session_id):
    data = {"session_id": session_id}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/session/followup", params=data, headers=headers)
    try:
        resp_json = response.json()
    except Exception:
        print("Followup: Response not JSON:", response.status_code, response.text)
        return {}
    print("Followup:", response.status_code, resp_json)
    return resp_json

def test_feedback(token, session_id):
    data = {"session_id": session_id}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/session/feedback", params=data, headers=headers)
    try:
        resp_json = response.json()
    except Exception:
        print("Feedback: Response not JSON:", response.status_code, response.text)
        return {}
    print("Feedback:", response.status_code, resp_json)
    return resp_json

if __name__ == "__main__":
    token = get_token()
    if not token:
        print("Failed to get token. Check credentials and try again.")
    else:
        # 1. Start a session
        start_result = test_start_session(token)
        session_id = start_result.get("session_id")
        questions = start_result.get("questions", [])

        # 2. Submit an answer (if questions exist)
        if session_id and questions:
            test_submit_answer(token, session_id, questions[0], "This is a sample answer.")
            # 3. Test followup
            test_followup(token, session_id)
            # 4. Test feedback
            test_feedback(token, session_id)
        else:
            print("Session or questions not returned correctly.")
