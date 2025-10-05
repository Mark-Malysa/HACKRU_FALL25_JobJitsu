// src/services/api.ts
import { supabase } from '@/lib/supabase';

const BACKEND_URL = "http://localhost:8000/api";

export interface SessionData {
  session_id: string;
  questions: string[];
  role: string;
  company: string;
}

export interface AnswerData {
  session_id: string;
  question: string;
  answer: string;
}

export interface FollowupData {
  session_id: string;
}

export interface FeedbackData {
  session_id: string;
}

class ApiService {
  private async getAuthHeaders(session?: any): Promise<HeadersInit> {
    let accessToken: string | null = null;

    // Try to get token from passed session first
    if (session?.access_token) {
      accessToken = session.access_token;
    } else {
      // Fallback: try to get session directly
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Direct session check:", currentSession);
        accessToken = currentSession?.access_token || null;
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }

    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async startSession(role: string, company: string, session?: any): Promise<SessionData> {
    try {
      const headers = await this.getAuthHeaders(session);
      
      const response = await fetch(`${BACKEND_URL}/session/start?role=${encodeURIComponent(role)}&company=${encodeURIComponent(company)}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        session_id: data.session_id,
        questions: data.questions,
        role,
        company,
      };
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }

  async getNextQuestion(sessionId: string, session?: any): Promise<{question_number: number, question: string, is_last_question: boolean, is_complete?: boolean}> {
    try {
      const headers = await this.getAuthHeaders(session);
      
      const response = await fetch(`${BACKEND_URL}/session/${sessionId}/next`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting next question:', error);
      throw error;
    }
  }

  async submitAnswer(sessionId: string, questionNumber: number, answer: string, session?: any): Promise<void> {
    try {
      const headers = await this.getAuthHeaders(session);
      
      const response = await fetch(`${BACKEND_URL}/session/${sessionId}/answer?question_number=${questionNumber}&answer=${encodeURIComponent(answer)}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  async getFollowup(sessionId: string, session?: any): Promise<{ follow_up: string; audio_b64?: string }> {
    try {
      const headers = await this.getAuthHeaders(session);
      
      const response = await fetch(`${BACKEND_URL}/session/${sessionId}/followup`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('ApiService.getFollowup raw:', data);
      // Return as-is to avoid key mismatch issues
      return data;
    } catch (error) {
      console.error('Error getting followup:', error);
      throw error;
    }
  }

  async submitFollowupAnswer(sessionId: string, answer: string, session?: any): Promise<void> {
    try {
      const headers = await this.getAuthHeaders(session);
      
      const response = await fetch(`${BACKEND_URL}/session/${sessionId}/followup-answer?answer=${encodeURIComponent(answer)}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting follow-up answer:', error);
      throw error;
    }
  }

  async getFeedback(sessionId: string, session?: any): Promise<{ feedback: string; score: number }> {
    try {
      const headers = await this.getAuthHeaders(session);
      
      const response = await fetch(`${BACKEND_URL}/session/${sessionId}/feedback`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        feedback: data.feedback,
        score: data.score || 0,
      };
    } catch (error) {
      console.error('Error getting feedback:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
