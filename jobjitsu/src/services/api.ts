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

  async submitAnswer(sessionId: string, question: string, answer: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BACKEND_URL}/session/answer?session_id=${encodeURIComponent(sessionId)}&question=${encodeURIComponent(question)}&answer=${encodeURIComponent(answer)}`, {
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

  async getFollowup(sessionId: string): Promise<string> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BACKEND_URL}/session/followup?session_id=${encodeURIComponent(sessionId)}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.follow_up;
    } catch (error) {
      console.error('Error getting followup:', error);
      throw error;
    }
  }

  async getFeedback(sessionId: string): Promise<{ feedback: string; score: number }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BACKEND_URL}/session/feedback?session_id=${encodeURIComponent(sessionId)}`, {
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
