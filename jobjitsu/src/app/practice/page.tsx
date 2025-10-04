"use client";
import React, { useState, useEffect } from "react";
import { Briefcase, Code, BrainCircuit, Loader2, Building, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";


export default function Practice() {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");

  const handleStartSession = () => {
    if (!role || !company) {
      alert("Please enter both a role and a company.");
      return;
    }
    console.log("Starting session for:", { role, company });
    // Add logic to start the interview session here
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Practice page - Session:", session);
      
      // If we already have a session, we're good
      if (session) {
        console.log("Session found, user is authenticated");
        setIsCheckingAuth(false);
        return;
      }
      
      // If no session, try to get it from Supabase directly
      console.log("No session from hook, checking Supabase directly...");
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      console.log("Practice page - Direct session check:", currentSession);
      console.log("Practice page - Error:", error);
      
      if (currentSession) {
        console.log("Session found via direct check, user is authenticated");
        setIsCheckingAuth(false);
      } else {
        console.log("No session found, redirecting to signin");
        router.push("/signin");
      }
    };

    checkAuth();
  }, [session, router, supabase]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no session after checking, don't render anything (will redirect)
  if (!session) {
    return null;
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
          --border: #2a2a2a;
          --muted-foreground: #999999;
        }

        .practice-body, .practice-body * {
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }

        .practice-container {
            background-color: var(--background);
            color: var(--foreground);
            min-height: 100vh;
            position: relative;
        }
        
        .content-wrapper {
            max-width: 1200px;
            margin: auto;
            padding: 8rem 1.5rem 4rem;
            position: relative;
            z-index: 1;
        }

        .practice-header {
            text-align: center;
            margin-bottom: 4rem;
        }
        .practice-header h1 {
            font-size: 3rem; font-weight: 800; line-height: 1.1; margin-bottom: 1rem;
        }
        .practice-header p {
            font-size: 1.125rem; color: var(--muted-foreground); max-width: 600px; margin: auto;
        }

        .main-practice-card {
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 5rem;
          text-align: center;
        }
        .main-practice-card h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .main-practice-card p {
          color: var(--muted-foreground);
          margin-bottom: 2.5rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .practice-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 500px;
          margin: 0 auto 2rem;
        }
        @media (min-width: 640px) {
          .practice-form {
            flex-direction: row;
          }
        }
        .input-group {
          position: relative;
          flex: 1;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted-foreground);
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          background-color: var(--background);
          color: var(--foreground);
          transition: border-color 0.2s, box-shadow 0.2s;
          font-size: 1rem;
        }
        .form-input::placeholder { color: var(--muted-foreground); }
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.3);
        }
        
        .start-session-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(to right, var(--accent), var(--primary));
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
        }
        .start-session-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.3);
        }

        .section-title {
            text-align: center;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--muted-foreground);
            margin-bottom: 2.5rem;
        }

        .practice-modes-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        @media (min-width: 768px) {
            .practice-modes-grid {
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            }
        }

        .mode-card {
            background-color: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            overflow: hidden;
            opacity: 0.6;
        }
        
        .mode-icon {
            display: inline-flex; justify-content: center; align-items: center;
            width: 60px; height: 60px;
            background: #333;
            border-radius: 12px; margin-bottom: 1.5rem; color: #888;
        }
        .mode-card h3 {
            font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem;
        }
        .mode-card p {
            color: var(--muted-foreground); line-height: 1.6;
        }
        .coming-soon-badge {
          position: absolute; top: 1rem; right: 1rem;
          background-color: var(--accent); color: white;
          padding: 0.25rem 0.75rem; border-radius: 99px;
          font-size: 0.75rem; font-weight: 500;
        }
      `}</style>
      <div className="practice-body">
        <div className="practice-container">
          <div className="content-wrapper">
            <div className="practice-header">
              <h1>Practice Sessions</h1>
              <p>Sharpen your skills and build confidence for your next interview.</p>
            </div>
            
            <div className="main-practice-card">
              <h2>Recruiter Career Fair Conversation</h2>
              <p>Simulate a short, impactful conversation with a recruiter at a career fair. Practice your elevator pitch and make a great first impression.</p>
              <div className="practice-form">
                <div className="input-group">
                  <User className="input-icon" size={20} />
                  <input 
                    type="text" 
                    placeholder="Enter target role..."
                    className="form-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <Building className="input-icon" size={20} />
                  <input 
                    type="text" 
                    placeholder="Enter target company..."
                    className="form-input"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={handleStartSession} className="start-session-btn">Start Session</button>
            </div>

            <h2 className="section-title">More Practice Modes</h2>
            
            <div className="practice-modes-grid">
              {[
                { title: "Behavioral Questions", description: "Practice common behavioral questions.", icon: <Briefcase size={28} /> },
                { title: "Technical Challenge", description: "Solve a coding problem live.", icon: <Code size={28} /> },
                { title: "AI Mock Interview", description: "Full interview simulation with an AI.", icon: <BrainCircuit size={28} /> },
              ].map((mode, index) => (
                <div key={index} className="mode-card">
                  <div className="coming-soon-badge">Coming Soon</div>
                  <div className="mode-icon">{mode.icon}</div>
                  <h3>{mode.title}</h3>
                  <p>{mode.description}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

