# JobJitsu Backend - OAuth Implementation

This backend provides OAuth authentication for the JobJitsu interview practice platform.

## Features

- **Supabase Authentication**: Email/password signup and login
- **OAuth Providers**: Google and GitHub OAuth integration
- **Session Management**: JWT token-based authentication
- **Database Integration**: MongoDB for user and session storage
- **AI Integration**: Gemini AI for interview questions and feedback

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=https://edjngujcarinzdehlywq.supabase.co/
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Configuration
MONGO_URI=mongodb+srv://mbmalysa_db_user:Q0lQfHlsLxiHwO56@interviewhubcluster.qxym3ax.mongodb.net/?retryWrites=true&w=majority&appName=InterviewHubCluster
DB_NAME=interviewhub
```

### 3. OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 4. Run the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Email/password signup
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/google` - Initiate Google OAuth
- `POST /api/auth/google/callback` - Handle Google OAuth callback
- `GET /api/auth/github` - Initiate GitHub OAuth
- `POST /api/auth/github/callback` - Handle GitHub OAuth callback

### Sessions

- `POST /api/session/start` - Start new interview session
- `POST /api/session/answer` - Submit answer to question
- `POST /api/session/followup` - Get follow-up question
- `POST /api/session/feedback` - Get session feedback

## OAuth Flow

### Google OAuth
1. Frontend calls `GET /api/auth/google`
2. Backend returns Google OAuth URL
3. User is redirected to Google for authentication
4. Google redirects back to frontend with authorization code
5. Frontend calls `POST /api/auth/google/callback` with code
6. Backend exchanges code for access token and user info
7. User is created/updated in database
8. Backend returns user info and access token

### GitHub OAuth
1. Frontend calls `GET /api/auth/github`
2. Backend returns GitHub OAuth URL
3. User is redirected to GitHub for authentication
4. GitHub redirects back to frontend with authorization code
5. Frontend calls `POST /api/auth/github/callback` with code
6. Backend exchanges code for access token and user info
7. User is created/updated in database
8. Backend returns user info and access token

## Security Features

- JWT token validation
- CORS configuration for frontend
- Secure OAuth token exchange
- User data validation
- Error handling and logging

## Database Schema

### Users Collection
```json
{
  "_id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "profile_picture_url",
  "provider": "google|github|email",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Sessions Collection
```json
{
  "_id": "session_id",
  "user_id": "user_id",
  "role": "Software Engineer",
  "company": "Google",
  "questions": ["question1", "question2"],
  "answers": [{"question": "q1", "answer": "a1"}],
  "follow_up": "follow_up_question",
  "feedback": "session_feedback",
  "score": 8.5,
  "created_at": "2024-01-01T00:00:00Z"
}
```
