// src/app/page.tsx (Updated colors for red/black theme)
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Target, MessageSquare, BarChart2 } from "lucide-react";

export default function Home() {
  // Define hero image dimensions for clarity
  const HERO_WIDTH = 520;
  const HERO_HEIGHT = 320;

  const logos = [
    { src: "/meta.png", alt: "Meta" },
    { src: "amazon.png", alt: "Amazon" },
    { src: "apple.png", alt: "Apple" },
    { src: "google.png", alt: "Google" },
    { src: "microsoft.png", alt: "Microsoft" },
    { src: "tesla.png", alt: "Tesla" },
    { src: "cisco.png", alt: "Cisco" },
    { src: "doordash.png", alt: "DoorDash" },
    {src: "xai.png", alt: "XAI"}
  ];

  // The `Image` component from Next.js is not available in this environment.
  // We'll use a standard `img` tag instead.
  const Image = (props) => <img {...props} />;

  return (
    <>
      {/* Self-contained styles to avoid conflicts with global CSS.
          This ensures the page looks consistent regardless of the environment. */}
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

        .homepage-body, .homepage-body * {
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }

        .homepage-container {
            background-color: var(--background);
            color: var(--foreground);
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
            padding: 4rem 1.5rem;
            position: relative;
            z-index: 1;
        }
        
        /* Hero Section */
        .hero-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4rem;
            margin-bottom: 8rem;
        }
        @media (min-width: 768px) {
            .hero-section {
                flex-direction: row;
            }
        }
        .hero-text {
            flex: 1;
            text-align: center;
        }
        @media (min-width: 768px) {
            .hero-text {
                text-align: left;
            }
        }
        .hero-text h1 {
            font-size: 3rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1.5rem;
        }
         @media (min-width: 768px) {
            .hero-text h1 {
                 font-size: 4rem;
            }
        }

        .hero-text p {
            font-size: 1.125rem;
            color: var(--muted-foreground);
            margin-bottom: 2rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        @media (min-width: 768px) {
            .hero-text p {
                margin-left: 0;
            }
        }

        .hero-buttons {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
        }
         @media (min-width: 640px) {
            .hero-buttons {
                flex-direction: row;
            }
        }
        @media (min-width: 768px) {
            .hero-buttons {
                justify-content: flex-start;
            }
        }
        
        .primary-btn {
          padding: 0.875rem 1.75rem;
          border: none;
          border-radius: 9999px;
          background: linear-gradient(to right, var(--accent), var(--primary));
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
          text-decoration: none;
          display: inline-block;
        }
        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.35);
        }
        .secondary-btn {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--foreground);
        }
        .secondary-btn:hover {
            background: var(--card);
            border-color: var(--primary);
        }

        .hero-image-wrapper {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .hero-image-card {
            background-color: rgba(26, 26, 26, 0.5);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 1rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .hero-image-card img {
            border-radius: 16px;
            object-fit: cover;
        }

        /* Section Title */
        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 4rem;
        }

        /* Features Section */
        .features-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-bottom: 8rem;
        }
        @media (min-width: 768px) {
            .features-grid {
                 grid-template-columns: repeat(3, 1fr);
            }
        }

        .feature-card {
            background-color: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            border-color: var(--primary);
        }
        .feature-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            background: linear-gradient(to right, var(--accent), var(--primary));
            border-radius: 12px;
            margin-bottom: 1.5rem;
            color: white;
        }
        .feature-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
        }
        .feature-card p {
            color: var(--muted-foreground);
            line-height: 1.6;
        }

        /* Trusted By Section */
        .trusted-section {
            text-align: center;
            margin-bottom: 8rem;
        }
        .trusted-section p {
            font-size: 1.125rem;
            color: var(--muted-foreground);
            max-width: 600px;
            margin: -3rem auto 3rem;
        }
        .logo-scroller {
            overflow: hidden;
            -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
            mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
        }
        .logo-track {
            display: flex;
            width: max-content;
            animation: scroll 40s linear infinite;
        }
        .logo-track img {
            height: 40px;
            margin: 0 2rem;
            filter: grayscale(1) brightness(1.5);
            opacity: 0.8;
            transition: all 0.3s ease;
        }
        .logo-track img:hover {
            filter: none;
            opacity: 1;
        }
        @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }

        /* CTA Section */
        .cta-section {
            background-color: var(--card);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 3rem;
            text-align: center;
        }
        .cta-section p {
            font-size: 1.125rem;
            color: var(--muted-foreground);
            margin: -3rem auto 2rem;
        }
      `}</style>
      <div className="homepage-body">
        <div className="homepage-container">
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>

          <div className="content-wrapper">
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-text">
                <h1>AI Interviewer for Job Interviews</h1>
                <p>Simulate real interviews and get actionable, intelligent feedback for job applications.</p>
                <div className="hero-buttons">
                  <a href="/signin" className="primary-btn">Try for free now! &rarr;</a>
                  <a href="#pricing" className="primary-btn secondary-btn">Explore Pricing</a>
                </div>
              </div>
              <div className="hero-image-wrapper">
                <div className="hero-image-card">
                  <Image
                    src="https://placehold.co/520x320/ff0000/ffffff?text=Interview"
                    alt="AI Interview Simulation"
                    width={HERO_WIDTH}
                    height={HERO_HEIGHT}
                  />
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section>
              <h2 className="section-title">How It Works</h2>
              <div className="features-grid">
                {[
                  { title: "Choose Your Mode", description: "Select from various interview modes tailored to your needs.", icon: <Target size={24} /> },
                  { title: "Engage in Realistic Interviews", description: "Practice with AI-driven interviews that mimic real-world scenarios.", icon: <MessageSquare size={24} /> },
                  { title: "Receive Actionable Feedback", description: "Get detailed feedback to improve your interview skills.", icon: <BarChart2 size={24} /> },
                ].map((step, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">{step.icon}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Trusted By Section */}
            <section className="trusted-section">
              <h2 className="section-title">Trusted by professionals from top companies</h2>
              <p>Prepare for interviews at FAANG and other leading companies with a tool designed for success.</p>
              <div className="logo-scroller">
                <div className="logo-track">
                  {[...logos, ...logos].map((logo, index) => (
                    <Image key={index} src={logo.src} alt={logo.alt} width={120} height={40} style={{ objectFit: 'contain' }}/>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
              <h2 className="section-title">Ready to Level Up?</h2>
              <p>Sign up today and start practicing for your dream job.</p>
              <a href="/signin" className="primary-btn">Sign Up / Sign In</a>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

