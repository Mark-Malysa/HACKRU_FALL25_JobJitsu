import React from 'react';

// Define a type for our FAQ item
type FaqItem = {
  question: string;
  answer: string;
};

// Data for the FAQ section (remains the same)
const faqs: FaqItem[] = [
  {
    question: 'How does the AI feedback work?',
    answer: 'Our AI analyzes your responses for key metrics like clarity, confidence, keyword usage, and speech patterns. It then provides specific, actionable suggestions to help you improve your delivery and content for your next interview.',
  },
  {
    question: 'Is there a free trial or a free plan?',
    answer: 'Yes! We offer a Basic plan that is free forever. It includes access to 5 AI interviews per month and standard performance feedback, allowing you to try our core features without any commitment.',
  },
  {
    question: 'What kind of roles and industries can I practice for?',
    answer: 'Our platform is highly customizable. You can tailor practice sessions for a wide range of roles and industries, from software engineering and marketing to finance and healthcare. The Pro plan gives you access to our full library of specialized questions.',
  },
  {
    question: 'How is my personal data and interview information handled?',
    answer: 'We take your privacy very seriously. All interview data is encrypted and stored securely. We do not share your personal information or interview recordings with third parties. You have full control to review and delete your data at any time.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Absolutely. You can cancel your Pro or Premium subscription at any time through your account settings. You will retain access to the paid features until the end of your current billing cycle.',
  },
];

// [Updated] Main FAQ page component without useState
const FAQPage = () => {
  // All state management (useState) has been removed.
  // The browser now handles the open/close state via the <details> element.

  return (
    <>
      {/* Self-contained styles updated for <details> and <summary> */}
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

        .faq-page-body, .faq-page-body * {
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .faq-container {
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
        .shape1 { width: 500px; height: 500px; background: var(--primary); top: -100px; right: -200px; }
        .shape2 { width: 450px; height: 450px; background: var(--accent); bottom: -150px; left: -150px; animation-delay: 4s; }
        @keyframes pulse { 0% { transform: scale(0.95); } 100% { transform: scale(1.05); } }

        .content-wrapper {
          max-width: 900px;
          margin: auto;
          padding: 6rem 1.5rem 5rem;
          position: relative;
          z-index: 1;
        }
        
        /* Page Header */
        .page-header { text-align: center; margin-bottom: 4rem; }
        .page-header h1 { font-size: 3rem; font-weight: 800; line-height: 1.1; margin-bottom: 1rem; }
        .page-header h1 span { color: var(--primary); }
        .page-header p { font-size: 1.125rem; color: var(--muted-foreground); max-width: 600px; margin: auto; }
        @media (min-width: 768px) { .page-header h1 { font-size: 4rem; } }
        
        /* [Updated] Accordion Styling for <details> element */
        .faq-list { border-radius: 16px; border: 1px solid var(--border); background-color: var(--card); overflow: hidden; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-item:last-child { border-bottom: none; }
        
        .faq-question { /* This class now applies to the <summary> tag */
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 1.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--foreground);
          cursor: pointer;
          transition: background-color 0.2s ease;
          list-style: none; /* Removes default summary marker */
        }
        .faq-question::-webkit-details-marker { display: none; /* Hides marker in Safari */ }
        .faq-question:hover { background-color: rgba(255, 255, 255, 0.03); }
        
        .faq-icon {
          flex-shrink: 0;
          transition: transform 0.3s ease-in-out;
          color: var(--muted-foreground);
        }
        details[open] .faq-icon { /* Use attribute selector */
          transform: rotate(45deg);
          color: var(--primary);
        }
        
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-in-out;
        }
        details[open] .faq-answer { /* Use attribute selector */
          max-height: 200px; /* Adjust if answers are longer */
        }
        .faq-answer p {
          padding: 0 1.5rem 1.5rem;
          color: var(--muted-foreground);
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
      <div className="faq-page-body">
        <div className="faq-container">
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>

          <main className="content-wrapper">
            <header className="page-header">
              <h1>
                <span>Frequently Asked</span> Questions
              </h1>
              <p>Have questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.</p>
            </header>

            <section>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  // Using the native <details> element for the accordion
                  <details key={index} className="faq-item">
                    <summary className="faq-question">
                      <span>{faq.question}</span>
                      <div className="faq-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </div>
                    </summary>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default FAQPage;