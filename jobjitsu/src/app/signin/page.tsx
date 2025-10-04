// src/app/signin/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";
import React, { useState } from "react";
// Using lucide-react for modern, clean icons
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Github } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(isSignUp ? "Check your email to confirm your account!" : "Welcome back!");
        if (!isSignUp) {
          router.push("/practice");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/signin`
        }
      });

      if (error) {
        console.error("Google OAuth error:", error);
        toast.error(error.message);
      } else {
        console.log("Google OAuth initiated successfully");
      }
    } catch (error) {
      console.error("Google OAuth exception:", error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/signin`
        }
      });

      if (error) {
        console.error("GitHub OAuth error:", error);
        toast.error(error.message);
      } else {
        console.log("GitHub OAuth initiated successfully");
      }
    } catch (error) {
      console.error("GitHub OAuth exception:", error);
      toast.error("Failed to sign in with GitHub");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* This style block contains all the CSS for the component.
        Using a style tag in a single-file component is a common practice for simplicity.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
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

        .auth-body, .auth-body * {
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }

        .auth-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
          padding: 1rem;
          overflow: auto; /* Use auto for scrolling on small screens */
        }

        .auth-bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          animation: pulse 12s infinite alternate;
        }

        .shape1 {
          width: 400px;
          height: 400px;
          background: var(--primary);
          top: -100px;
          left: -100px;
        }

        .shape2 {
          width: 350px;
          height: 350px;
          background: var(--accent);
          bottom: -100px;
          right: -100px;
          animation-delay: 3s;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.9) rotate(0deg);
          }
          100% {
            transform: scale(1.1) rotate(15deg);
          }
        }

        .auth-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--border);
          transition: all 0.3s ease;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem 1.5rem;
          }
        }

        .back-link {
          position: absolute;
          top: -3rem;
          left: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--muted-foreground);
          transition: color 0.2s;
          text-decoration: none;
        }
        .back-link:hover {
          color: var(--foreground);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--card-foreground);
          margin: 0 0 0.5rem 0;
        }

        .auth-header p {
          color: var(--muted-foreground);
          margin: 0;
        }
        
        .oauth-providers {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .oauth-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background-color: transparent;
          font-weight: 500;
          color: var(--card-foreground);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .oauth-btn:hover {
          border-color: var(--primary);
          background-color: rgba(255, 0, 0, 0.05);
        }
        .oauth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .oauth-btn .google-svg-path {
          transition: fill 0.2s;
        }
        .oauth-btn:hover .google-svg-path {
            fill: #fff;
        }
        .oauth-btn .github-svg {
            color: var(--muted-foreground);
            transition: color 0.2s;
        }
        .oauth-btn:hover .github-svg {
            color: #fff;
        }


        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--muted-foreground);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border);
        }
        .divider:not(:empty)::before {
          margin-right: .5em;
        }
        .divider:not(:empty)::after {
          margin-left: .5em;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #cccccc;
          margin-bottom: 0.5rem;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted-foreground);
          pointer-events: none;
        }
        .auth-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          background-color: var(--background);
          color: var(--foreground);
          transition: border-color 0.2s, box-shadow 0.2s;
          font-size: 1rem;
        }
        .auth-input::placeholder {
            color: var(--muted-foreground);
        }
        .auth-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.3);
        }
        .password-toggle {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--muted-foreground);
          border-radius: 99px;
        }
        .password-toggle:hover {
          color: var(--foreground);
        }
        
        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(to right, var(--accent), var(--primary));
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.3);
        }
        .submit-btn:active {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          background: #333;
          color: #888;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .loader {
          width: 18px;
          height: 18px;
          border: 2px solid #fff;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
          margin-right: 0.5rem;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .toggle-auth {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--muted-foreground);
        }
        .toggle-auth button {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          font-size: inherit;
        }
        .toggle-auth button:hover {
          text-decoration: underline;
        }

        .error-message {
          color: var(--primary);
          font-size: 0.875rem;
          text-align: center;
          margin-top: 1rem;
          min-height: 1.25rem;
        }

        .footer-text {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.75rem;
          color: var(--muted-foreground);
        }
        .footer-text a {
          color: #ccc;
          text-decoration: underline;
        }
        .footer-text a:hover {
          color: var(--foreground);
        }
      `}</style>
      <div className="auth-body">
        <div className="auth-container">
          <div className="auth-bg-shape shape1"></div>
          <div className="auth-bg-shape shape2"></div>
          
          <main>
            <div className="auth-card">
              {/* A link to go back home, positioned relatively */}
              <a href="/" className="back-link">
                <ArrowLeft size={16} />
                Back to Home
              </a>
              
              <div className="auth-header">
                <h1>{isSignUp ? "Create an Account" : "Welcome Back"}</h1>
                <p>{isSignUp ? "Join us to start your journey." : "Sign in to continue your progress."}</p>
              </div>

              <div className="oauth-providers">
                  <button onClick={handleGoogleAuth} disabled={isLoading} className="oauth-btn">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_105_1383)"><path className="google-svg-path" d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.27H19.57C21.65 18.35 22.56 15.54 22.56 12.25Z" fill="#4285F4"/><path className="google-svg-path" d="M12 23C15.97 23 19.34 21.63 21.57 19.27L17.71 16.57C16.54 17.35 14.88 17.81 12 17.81C8.13 17.81 4.87 15.39 3.68 12.04H0V14.81C2.18 19.43 6.7 23 12 23Z" fill="#34A853"/><path className="google-svg-path" d="M5.84 14.09C5.62 13.42 5.48 12.72 5.48 12C5.48 11.28 5.62 10.58 5.84 9.91V7.14H2C1.43 8.26 1 9.58 1 11C1 12.42 1.43 13.74 2 14.86L5.84 12.09V14.09Z" fill="#FBBC05"/><path className="google-svg-path" d="M12 5.19C14.22 5.19 15.95 6.05 17.25 7.27L20.84 3.68C18.34 1.45 15.47 0 12 0C6.7 0 2.18 3.57 0 8.19L3.84 10.96C5.03 7.61 8.29 5.19 12 5.19Z" fill="#EA4335"/></g><defs><clipPath id="clip0_105_1383"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
                      <span>Google</span>
                  </button>
                  <button onClick={handleGitHubAuth} disabled={isLoading} className="oauth-btn">
                      <Github size={20} className="github-svg" />
                      <span>GitHub</span>
                  </button>
              </div>

              <div className="divider">or</div>

              <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(); }}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="auth-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="auth-input"
                      style={{paddingRight: '2.5rem'}}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="error-message">
                  {error}
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <><span className="loader"></span> Processing...</>
                  ) : (
                    isSignUp ? "Create Account" : "Sign In"
                  )}
                </button>
              </form>

              <div className="toggle-auth">
                <p>
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                  <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </div>
            <p className="footer-text">
              By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </main>
        </div>
      </div>
    </>
  );
}

