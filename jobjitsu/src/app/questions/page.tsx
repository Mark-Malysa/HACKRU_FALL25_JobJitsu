import React from 'react';

// Define a type for our FAQ items
type FAQItem = {
  question: string;
};

// Data for the frequently asked questions (remains the same)
const recruiterFAQs: FAQItem[] = [
  { question: "What's a project you're most proud of?" },
  { question: "How do you stay up-to-date with new technologies?" },
  { question: "What's a technical challenge you've faced and how did you overcome it?" },
  { question: "Can you describe a time you worked on a team to solve a problem?" },
  { question: "What is your experience with [specific technology, e.g., Supabase, Flutter]?" },
  { question: "Tell me about a time you received constructive feedback." },
  { question: "How do you approach learning a new programming language or framework?" },
  { question: "What are your career goals for the next 3-5 years?" },
  { question: "How do you handle debugging a complex issue?" },
  { question: "What makes you a good fit for this role?" },
];

// [New] Component for a single question card
const QuestionCard = ({ question }: FAQItem) => {
  return (
    <div className="question-card">
      <div className="question-icon">
        {/* Simple SVG icon for a question mark */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h3 className="question-text">{question}</h3>
    </div>
  );
};

// [New] Main page component with modern styling
const QuestionsPage = () => {
  return (
    <>
      {/* Self-contained styles mirroring the example's aesthetic */}
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

        .questions-page-body, .questions-page-body * {
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .questions-container {
          background-color: var(--background);
          color: var(--foreground);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        /* Animated background shapes for a modern feel */
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
          top: -150px; left: -150px;
        }
        .shape2 {
          width: 450px; height: 450px;
          background: var(--accent);
          bottom: -200px; right: -200px;
          animation-delay: 5s;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); }
          100% { transform: scale(1.1); }
        }

        .content-wrapper {
          max-width: 900px;
          margin: auto;
          /* Top padding accounts for a fixed navbar */
          padding: 6rem 1.5rem 4rem;
          position: relative;
          z-index: 1;
        }
        
        /* Page Header */
        .page-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .page-header h1 {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
          color: var(--foreground);
        }
        .page-header h1 span {
          color: var(--primary);
        }
        .page-header p {
          font-size: 1.125rem;
          color: var(--muted-foreground);
          max-width: 600px;
          margin: auto;
        }
        @media (min-width: 768px) {
          .page-header h1 {
            font-size: 4rem;
          }
        }
        
        /* Section Title */
        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        /* Question Card Styling */
        .question-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          transition: all 0.3s ease;
          cursor: default;
        }
        .question-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 8px 30px rgba(255, 0, 0, 0.1);
        }
        .question-icon {
          flex-shrink: 0;
          color: var(--primary);
        }
        .question-text {
          font-size: 1rem;
          font-weight: 500;
          color: var(--foreground);
          line-height: 1.6;
        }
      `}</style>

      <div className="questions-page-body">
        <div className="questions-container">
          {/* Background shapes */}
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>

          <main className="content-wrapper">
            <header className="page-header">
              <h1>
                Interview <span>Questions</span>
              </h1>
              <p>A curated list of common questions to help you prepare and succeed in your next interview.</p>
            </header>

            <section>
              <h2 className="section-title">Common Recruiter Questions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recruiterFAQs.map((faq) => (
                  <QuestionCard key={faq.question} question={faq.question} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default QuestionsPage;