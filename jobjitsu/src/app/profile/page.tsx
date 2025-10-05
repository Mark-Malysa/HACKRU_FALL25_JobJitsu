"use client";
import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Calendar, Building, Briefcase, Trophy, TrendingUp } from "lucide-react";

interface SessionData {
  _id: string;
  user_id: string;
  role: string;
  company: string;
  created_at: string;
  feedback?: {
    score: number;
    description: string;
  };
  follow_up_question?: string;
  follow_up_answer?: string;
}

interface UserStats {
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  recentSessions: SessionData[];
}

export default function Profile() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Profile page - checking auth, session:", session);
      
      // Wait longer for session to be established
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check session again after waiting
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Profile page - session after wait:", currentSession);
      
      if (!currentSession && !session) {
        console.log("Profile page - no session, redirecting to signin");
        setIsCheckingAuth(false);
        router.push("/signin");
        return;
      }
      
      console.log("Profile page - session found, fetching user stats");
      setIsCheckingAuth(false);
      await fetchUserStats();
    };
    checkAuth();
  }, [session, router, supabase]);

  const fetchUserStats = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get fresh session token
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token || session?.access_token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`http://localhost:8000/api/user/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user stats: ${response.status}`);
      }

      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      
      // Retry once if it's an auth error and we haven't retried yet
      if (retryCount === 0 && (error instanceof Error && error.message.includes('token'))) {
        console.log("Retrying fetchUserStats...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchUserStats(1);
      }
      
      setError(error instanceof Error ? error.message : "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default";
    if (score >= 6) return "secondary";
    return "destructive";
  };

  if (isCheckingAuth || isLoading) {
    return (
      <div className="profile-body">
        <div className="profile-container">
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>
          
          <div className="content-wrapper">
            <div className="loading-card">
              <div className="loading-spinner"></div>
              <p className="loading-text">{isCheckingAuth ? "Checking authentication..." : "Loading your profile..."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-body">
        <div className="profile-container">
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>
          
          <div className="content-wrapper">
            <div className="error-card">
              <h2 className="error-title">Error Loading Profile</h2>
              <p className="error-message">{error}</p>
              <Button onClick={() => fetchUserStats()} className="retry-button">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        .profile-body, .profile-body * {
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }

        .profile-container {
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

        .profile-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .profile-title {
            font-size: 3rem;
            font-weight: 800;
            color: var(--foreground);
            margin-bottom: 1rem;
        }

        .profile-subtitle {
            font-size: 1.25rem;
            color: var(--muted-foreground);
            margin-bottom: 2rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }

        .stat-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            text-align: center;
            transition: transform 0.2s ease;
        }

        .stat-card:hover {
            transform: translateY(-4px);
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 1rem;
            color: var(--primary);
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--foreground);
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: var(--muted-foreground);
            font-size: 1rem;
        }

        .sessions-section {
            margin-bottom: 3rem;
        }

        .section-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--foreground);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .sessions-grid {
            display: grid;
            gap: 1.5rem;
        }

        .session-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
        }

        .session-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .session-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }

        .session-info {
            flex: 1;
        }

        .session-role {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--foreground);
            margin-bottom: 0.25rem;
        }

        .session-company {
            color: var(--muted-foreground);
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }

        .session-date {
            color: var(--muted-foreground);
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .session-score {
            text-align: right;
        }

        .score-value {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 0.25rem;
        }

        .score-label {
            color: var(--muted-foreground);
            font-size: 0.875rem;
        }

        .session-feedback {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border);
        }

        .feedback-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--foreground);
            margin-bottom: 0.5rem;
        }

        .feedback-text {
            color: var(--muted-foreground);
            line-height: 1.6;
            font-size: 0.9rem;
        }

        .loading-card, .error-card {
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

        .loading-text, .error-message {
            color: var(--muted-foreground);
            font-size: 1.125rem;
            margin: 0;
        }

        .error-title {
            color: var(--foreground);
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .retry-button {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            border: none;
            border-radius: 12px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 1rem;
        }

        .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
            .content-wrapper {
                padding: 1rem;
            }
            
            .profile-title {
                font-size: 2rem;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .session-header {
                flex-direction: column;
                align-items: stretch;
            }
            
            .session-score {
                text-align: left;
                margin-top: 1rem;
            }
        }
      `}</style>
      
      <div className="profile-body">
        <div className="profile-container">
          {/* Background shapes */}
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>
          
          <div className="content-wrapper">
            {/* Header */}
            <div className="profile-header">
              <h1 className="profile-title">Your Profile</h1>
              <p className="profile-subtitle">Track your interview progress and performance</p>
            </div>

            {/* Stats Grid */}
            {userStats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <Trophy className="stat-icon" />
                  <div className="stat-value">{userStats.totalSessions}</div>
                  <div className="stat-label">Total Sessions</div>
                </div>
                <div className="stat-card">
                  <TrendingUp className="stat-icon" />
                  <div className="stat-value">{userStats.averageScore.toFixed(1)}</div>
                  <div className="stat-label">Average Score</div>
                </div>
                <div className="stat-card">
                  <Star className="stat-icon" />
                  <div className="stat-value">{userStats.bestScore}</div>
                  <div className="stat-label">Best Score</div>
                </div>
              </div>
            )}

            {/* Recent Sessions */}
            <div className="sessions-section">
              <h2 className="section-title">
                <Briefcase className="w-6 h-6" />
                Recent Sessions
              </h2>
              
              {userStats?.recentSessions.length === 0 ? (
                <div className="session-card">
                  <p className="text-muted-foreground text-center py-8">
                    No sessions yet. Start your first interview practice!
                  </p>
                </div>
              ) : (
                <div className="sessions-grid">
                  {userStats?.recentSessions.map((session) => (
                    <div key={session._id} className="session-card">
                      <div className="session-header">
                        <div className="session-info">
                          <div className="session-role">{session.role}</div>
                          <div className="session-company">
                            <Building className="w-4 h-4 inline mr-1" />
                            {session.company}
                          </div>
                          <div className="session-date">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {formatDate(session.created_at)}
                          </div>
                        </div>
                        <div className="session-score">
                          <div className={`score-value ${getScoreColor(session.feedback?.score || 0)}`}>
                            {session.feedback?.score || 'N/A'}
                          </div>
                          <div className="score-label">/ 10</div>
                        </div>
                      </div>
                      
                      {session.feedback && (
                        <div className="session-feedback">
                          <div className="feedback-title">Feedback</div>
                          <div className="feedback-text">
                            {session.feedback.description}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}