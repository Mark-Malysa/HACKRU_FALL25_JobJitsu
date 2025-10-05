// src/app/interview/session/[id]/page.tsx (Updated for red/black theme)
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatBubble } from "@/components/ChatBubble";
import { ScoreCard } from "@/components/ScoreCard";
import { PersonaChip } from "@/components/PersonaChip";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { use } from "react";
import { apiService } from "@/services/api";
import { useSession } from "@supabase/auth-helpers-react";

// Utility to play audio from base64 string
function playAudioFromBase64(base64String: string) {
  const audioSrc = `data:audio/mp3;base64,${base64String}`;
  const audio = new Audio(audioSrc);
  audio.play().catch((err) => {
    console.error("Audio playback error:", err);
  });
}


type Message = {
  role: "recruiter" | "you";
  text: string;
  voiceUrl?: string | null;
  feedback?: any;
};

// Add type for nextQuestion to include audio_b64
type NextQuestion = {
  question_number: number;
  question: string;
  is_last_question: boolean;
  is_complete?: boolean;
  audio_b64?: string;
};

async function fetchNextQuestion(id: string, session: any) {
  return await apiService.getNextQuestion(id, session);
}

async function submitAnswer({ id, questionNumber, userAnswerText, session }: { id: string; questionNumber: number; userAnswerText: string; session: any }) {
  return await apiService.submitAnswer(id, questionNumber, userAnswerText, session);
}

async function fetchFollowup(id: string, session: any) {
  return await apiService.getFollowup(id, session);
}

async function submitFollowupAnswer(id: string, answer: string, session: any) {
  return await apiService.submitFollowupAnswer(id, answer, session);
}


// Feedback type with audio_b64
type FeedbackResponse = {
  feedback: string;
  score: number;
  audio_b64?: string;
};

async function fetchFeedback(id: string, session: any): Promise<FeedbackResponse> {
  return await apiService.getFeedback(id, session);
}

async function completeSession(id: string) {
  const res = await fetch(`/session/${id}/complete`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to complete session");
  return res.json();
}




export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const session = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState("");
  const [persona, setPersona] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [isFollowupPhase, setIsFollowupPhase] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const { data: nextQuestion, isLoading: loadingNext } = useQuery<NextQuestion>({
    queryKey: ["nextQuestion", id, questionCount],
    queryFn: () => fetchNextQuestion(id, session),
    enabled: messages.length % 2 === 0 && !!session && questionCount < 3 && !isFollowupPhase,
  });

  const mutation = useMutation({
    mutationFn: submitAnswer,
    onSuccess: async () => {
      setAnswer("");
      const newQuestionCount = questionCount + 1;
      setQuestionCount(newQuestionCount);
      console.log(`Answer submitted! Question count: ${newQuestionCount}/3, Follow-up phase: ${isFollowupPhase}`);
      toast.success("Answer submitted!");
      
      // After 3rd question, ask follow-up question
      if (newQuestionCount >= 3 && !isFollowupPhase) {
        console.log("All 3 questions completed, asking follow-up question...");
        setIsFollowupPhase(true);
        try {
          const followup = await fetchFollowup(id, session);
          setMessages((m) => [...m, { role: "recruiter", text: followup, voiceUrl: null }]);
        } catch (error) {
          console.error("Error fetching followup:", error);
        }
      } 
      // After follow-up answer, generate feedback
      else if (isFollowupPhase && !isCompleted) {
        console.log("Follow-up answered, submitting answer and generating feedback...");
        setIsCompleted(true);
        try {
          // First submit the follow-up answer
          await submitFollowupAnswer(id, answer, session);
          console.log("Follow-up answer submitted successfully");

          // Then generate feedback
          const feedback = await fetchFeedback(id, session);
          setMessages((m) => [...m, { role: "recruiter", text: `Here's your interview feedback (Score: ${feedback.score}/10):\n\n${feedback.feedback}`, feedback }]);

          // Play feedback audio if present
          if (feedback.audio_b64) {
            console.log("Playing feedback audio...");
            playAudioFromBase64(feedback.audio_b64);
          } else {
            console.log("No audio_b64 found in feedback");
          }
        } catch (error) {
          console.error("Error submitting follow-up answer or fetching feedback:", error);
        }
      } else {
        console.log(`Still need ${3 - newQuestionCount} more questions`);
      }
    },
  });

  useEffect(() => {
    if (nextQuestion) {
      console.log("Next question received:", nextQuestion);
      console.log("Current question count:", questionCount);
      setMessages((m) => [...m, { role: "recruiter", text: nextQuestion.question, voiceUrl: null }]);
    }
  }, [nextQuestion, questionCount]);

  // Play audio when nextQuestion.audio_b64 is present
  useEffect(() => {
    if (nextQuestion && nextQuestion.audio_b64) {
      console.log("Playing audio for question...");
      playAudioFromBase64(nextQuestion.audio_b64);
    } else if (nextQuestion) {
      console.log("No audio_b64 found in nextQuestion");
    }
  }, [nextQuestion]);

  useEffect(() => {
    setPersona({ name: "Avery", bias_mode: "off" });
  }, []);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const lastQ = messages[messages.length - 1]?.text;
    setMessages((m) => [...m, { role: "you", text: answer }]);
    // Get the current question number from the query data
    const currentQuestionNumber = nextQuestion?.question_number || 1;
    mutation.mutate({ id: id, questionNumber: currentQuestionNumber, userAnswerText: answer, session: session });
  };

  const handleComplete = async () => {
    const summary = await completeSession(id);
    toast.info("Session completed!");
    router.push("/profile");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "Enter") handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer]);


  // Instead of hiding the chatbox, show a spinner overlay or disable input when loadingNext
  // We'll use a loading overlay inside the chat container

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        :root {
          --background: #0a0a0a;
          --foreground: #fafafa;
          --primary: #ff0000;
          --accent: #cc0000;
          --card: #1a1a1a;
          --card-foreground: #fafafa;
          --border: #2a2a2a;
          --muted-foreground: #999999;
        }

        .interview-body, .interview-body * {
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }

        .interview-container {
            background-color: var(--background);
            color: var(--foreground);
            min-height: 100vh;
            position: relative;
            overflow: hidden;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          z-index: 0;
          animation: pulse 15s infinite alternate;
        }
        .shape1 {
          width: 500px; height: 500px;
          background: var(--primary);
          top: -150px; left: -150px;
        }
        .shape2 {
          width: 450px; height: 450px;
          background: var(--accent);
          bottom: -150px; right: -150px;
          animation-delay: 4s;
        }
        @keyframes pulse {
          0% { transform: scale(0.9) rotate(0deg); }
          100% { transform: scale(1.1) rotate(15deg); }
        }

        .content-wrapper {
            max-width: 1200px;
            margin: auto;
            padding: 2rem 1.5rem;
            position: relative;
            z-index: 1;
        }

        .interview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .interview-title {
            font-size: 2rem;
            font-weight: 800;
            color: var(--foreground);
            margin: 0;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .chat-container {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
            max-height: 60vh;
            overflow-y: auto;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .chat-messages {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .loading-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 3rem;
            text-align: center;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            color: var(--muted-foreground);
            font-size: 1.125rem;
            margin: 0;
        }

        .answer-section {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .answer-textarea {
            width: 100%;
            min-height: 120px;
            background: var(--background);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1rem;
            color: var(--foreground);
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            resize: vertical;
            transition: all 0.2s ease;
        }

        .answer-textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
        }

        .answer-textarea::placeholder {
            color: var(--muted-foreground);
        }

        .answer-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .submit-button {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            border: none;
            border-radius: 12px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 16px rgba(255, 0, 0, 0.3);
        }

        .submit-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
        }

        .submit-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .end-session-button {
            background: transparent;
            color: var(--muted-foreground);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 0.75rem 1.5rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .end-session-button:hover {
            background: var(--border);
            color: var(--foreground);
        }

        .feedback-section {
            margin-top: 2rem;
        }

        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--muted-foreground);
            font-style: italic;
        }

        .typing-dots {
            display: flex;
            gap: 0.25rem;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            background: var(--muted-foreground);
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        @media (max-width: 768px) {
            .content-wrapper {
                padding: 1rem;
            }
            
            .interview-header {
                flex-direction: column;
                align-items: stretch;
            }
            
            .header-actions {
                justify-content: space-between;
            }
            
            .chat-container {
                padding: 1.5rem;
            }
            
            .answer-section {
                padding: 1.5rem;
            }
        }
      `}</style>
      
      <div className="interview-body">
        <div className="interview-container">
          {/* Background shapes */}
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>
          
          <div className="content-wrapper">
            {/* Header */}
            <div className="interview-header">
              <h1 className="interview-title">Interview Session</h1>
              <div className="header-actions">
                {/* <button onClick={handleComplete} className="end-session-button">
          End Session
                </button> */}
              </div>
      </div>

            {/* Chat Messages */}
            <div className="chat-container">
              <div className="chat-messages">
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} voiceUrl={m.voiceUrl ?? undefined} feedback={m.feedback} />
        ))}
                {mutation.isPending && (
                  <div className="typing-indicator">
                    <span>Processing your answer</span>
                    <div className="typing-dots">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
              </div>
      </div>

            {/* Answer Input */}
            <div className="answer-section">
              <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
                placeholder={isCompleted ? "Interview completed! Thank you for your time." : "Type your answer here... Use the STAR method (Situation, Task, Action, Result) for best results."}
                className="answer-textarea"
                disabled={mutation.isPending || isCompleted}
              />
              <div className="answer-actions">
                <div className="typing-indicator">
                  <span>
                    {isCompleted ? "Interview completed! Check your feedback below." : 
                     isFollowupPhase ? "This is a follow-up question. Press Cmd+Enter to submit." :
                     "Press Cmd+Enter to submit"}
                  </span>
                </div>
                <button 
                  onClick={handleSubmit} 
                  disabled={mutation.isPending || !answer.trim() || isCompleted} 
                  className="submit-button"
                >
                  {isCompleted ? 'Interview Completed' : (mutation.isPending ? 'Submitting...' : 'Submit Answer')}
                </button>
        </div>
      </div>

            {/* Feedback Section */}
      {messages.some((m) => m.feedback) && (
              <div className="feedback-section">
                <ScoreCard 
                  rubric={messages[messages.length - 1]?.feedback?.rubric || {}} 
                  score_overall={messages[messages.length - 1]?.feedback?.score_overall || 0} 
                />
        </div>
      )}
    </div>
        </div>
      </div>
    </>
  );
}