import React from 'react';

// Define a type for our feature items
type Feature = {
  title: string;
  description: string;
  icon: JSX.Element; // The icon will be a React component (SVG)
};

// Data for the features, including SVG icons
const features: Feature[] = [
  {
    title: 'AI-Powered Feedback',
    description: 'Receive detailed, constructive feedback on your answers, delivery, and body language from our advanced AI.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10c0-4.42-3.58-8-8-8a10 10 0 0 0-4 8"/>
        <path d="M12 2v4M10 4.5A6 6 0 1 1 4.5 10M12 2a10 10 0 0 0-4 8"/>
      </svg>
    ),
  },
  {
    title: 'Realistic Simulations',
    description: 'Engage in interviews that mimic real-world scenarios, with dynamic questions that adapt to your responses.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    title: 'Performance Analytics',
    description: 'Track your progress over time with in-depth analytics. Identify your strengths and pinpoint areas for improvement.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
  },
  {
    title: 'Customizable Interviews',
    description: 'Tailor your practice sessions by selecting specific roles, industries, and interview styles to match your goals.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
  },
];

// [New] Component for a single feature card
const FeatureCard = ({ title, description, icon }: Feature) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

// [New] Main page component with modern styling
const FeaturesPage = () => {
  return (
    <>
      {/* Self-contained styles for the features page */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        :root {
          --background: #0a0a0a;
          --foreground: #fafafa;
          --primary: #ff0000;
          --accent: #cc0000;
          --card: #1a1a1a;
          --border: #2a2a2a;
          --muted-foreground: #a1a1aa;
        }

        .features-page-body, .features-page-body * {
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .features-container {
          background-color: var(--background);
          color: var(--foreground);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        /* Animated background shapes */
        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.15;
          z-index: 0;
          animation: pulse 20s infinite alternate;
        }
        .shape1 {
          width: 500px; height: 500px;
          background: var(--primary);
          top: -150px; right: -150px;
          animation-delay: 2s;
        }
        .shape2 {
          width: 450px; height: 450px;
          background: var(--accent);
          bottom: -200px; left: -200px;
          animation-delay: 6s;
        }
        @keyframes pulse {
          0% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1.1) rotate(5deg); }
        }

        .content-wrapper {
          max-width: 1100px;
          margin: auto;
          padding: 6rem 1.5rem 4rem;
          position: relative;
          z-index: 1;
        }
        
        /* Page Header */
        .page-header {
          text-align: center;
          margin-bottom: 5rem;
        }
        .page-header h1 {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .page-header h1 span {
          color: var(--primary);
        }
        .page-header p {
          font-size: 1.125rem;
          color: var(--muted-foreground);
          max-width: 650px;
          margin: auto;
        }
        @media (min-width: 768px) {
          .page-header h1 {
            font-size: 4rem;
          }
        }
        
        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
            .features-grid {
              grid-template-columns: repeat(4, 1fr);
            }
        }

        /* Feature Card Styling */
        .feature-card {
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          text-align: left;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
          box-shadow: 0 8px 30px rgba(255, 0, 0, 0.1);
        }
        .feature-icon {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 48px;
          height: 48px;
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
      `}</style>

      <div className="features-page-body">
        <div className="features-container">
          {/* Background shapes */}
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>

          <main className="content-wrapper">
            <header className="page-header">
              <h1>
                Powerful <span>Features</span>
              </h1>
              <p>
                Our platform is packed with cutting-edge tools designed to give you the confidence and skills to ace your next interview.
              </p>
            </header>

            <section>
              <div className="features-grid">
                {features.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default FeaturesPage;