import React from 'react';

// Define a type for a resource item
type Resource = {
  id: number;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  link: string;
};

// Data for the resources page
const resources: Resource[] = [
  {
    id: 1,
    category: 'Interview Tips',
    title: 'The STAR Method: Acing Behavioral Questions',
    description: 'Learn how to structure your answers to behavioral questions effectively using the STAR method to showcase your accomplishments.',
    author: 'Novoresume',
    date: 'Oct 02, 2025',
    readTime: '6 min read',
    link: 'https://novoresume.com/career-blog/interview-star-method',
  },
  {
    id: 2,
    category: 'Resume Writing',
    title: 'How to Quantify Your Resume Accomplishments',
    description: 'Move beyond listing job duties. This guide shows you how to use numbers and data to highlight your impact and catch a recruiter\'s eye.',
    author: 'Resume Worded',
    date: 'Sep 28, 2025',
    readTime: '8 min read',
    link: 'https://resumeworded.com/how-to-quantify-resume-key-advice',
  },
  {
    id: 3,
    category: 'Technical Skills',
    title: 'Mastering System Design for Technical Interviews',
    description: 'A comprehensive walkthrough of common system design concepts and questions, essential for senior tech roles.',
    author: 'DesignGurus',
    date: 'Sep 25, 2025',
    readTime: '15 min read',
    link: 'https://www.designgurus.io/blog/mastering-the-system-design-interview-complete-guide',
  },
  {
    id: 4,
    category: 'Career Growth',
    title: 'Negotiating Your Salary: A Step-by-Step Guide',
    description: 'Gain the confidence and strategies you need to negotiate your salary and compensation package effectively.',
    author: 'Fearless Salary Negotiation',
    date: 'Sep 21, 2025',
    readTime: '10 min read',
    link: 'https://fearlesssalarynegotiation.com/salary-negotiation-guide/',
  },
  {
    id: 5,
    category: 'Interview Tips',
    title: 'Top 10 Questions to Ask Your Interviewer',
    description: 'Show your engagement and learn crucial information about the company culture and role by asking insightful questions.',
    author: 'The Muse',
    date: 'Sep 18, 2025',
    readTime: '5 min read',
    link: 'https://www.themuse.com/advice/51-interview-questions-you-should-be-asking',
  },
   {
    id: 6,
    category: 'Resume Writing',
    title: 'Beating the ATS: How to Optimize Your Resume',
    description: 'Learn how Applicant Tracking Systems (ATS) work and how to tailor your resume to pass the initial screening.',
    author: 'Jobscan',
    date: 'Sep 15, 2025',
    readTime: '7 min read',
    link: 'https://www.jobscan.co/blog/ats-resume/',
  },
];

// [New] Component for a single resource card
const ResourceCard = ({ resource }: { resource: Resource }) => {
  return (
    <a href={resource.link} className="resource-card">
      <div className="card-content">
        <p className="card-category">{resource.category}</p>
        <h3 className="card-title">{resource.title}</h3>
        <p className="card-description">{resource.description}</p>
      </div>
      <div className="card-footer">
        <div className="card-meta">
          <span>By {resource.author}</span>
          <span>&bull;</span>
          <span>{resource.date}</span>
          <span>&bull;</span>
          <span>{resource.readTime}</span>
        </div>
        <div className="card-link">
          Read More &rarr;
        </div>
      </div>
    </a>
  );
};


// [New] Main Resources page component
const ResourcesPage = () => {
  return (
    <>
      {/* Self-contained styles for the resources page */}
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

        .resources-page-body, .resources-page-body * {
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .resources-container {
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
          animation: pulse 22s infinite alternate;
        }
        .shape1 { width: 500px; height: 500px; background: var(--primary); top: -150px; left: -150px; animation-delay: 2s; }
        .shape2 { width: 450px; height: 450px; background: #4a00ff; bottom: -200px; right: -200px; animation-delay: 6s; }
        @keyframes pulse {
          0% { transform: scale(0.9) rotate(-15deg); }
          100% { transform: scale(1.1) rotate(15deg); }
        }

        .content-wrapper {
          max-width: 1200px;
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
        
        /* Resources Grid */
        .resources-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) { .resources-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .resources-grid { grid-template-columns: repeat(3, 1fr); } }

        /* Resource Card Styling */
        .resource-card {
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: var(--foreground);
          transition: all 0.3s ease;
        }
        .resource-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
          box-shadow: 0 8px 30px rgba(255, 0, 0, 0.1);
        }
        .card-content { flex-grow: 1; }
        
        .card-category {
          display: inline-block;
          background-color: rgba(255, 0, 0, 0.1);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        .card-description {
          font-size: 1rem;
          color: var(--muted-foreground);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .card-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--muted-foreground);
        }
        .card-link {
          font-weight: 600;
          color: var(--primary);
          transition: transform 0.2s ease;
        }
        .resource-card:hover .card-link {
          transform: translateX(4px);
        }
      `}</style>
      <div className="resources-page-body">
        <div className="resources-container">
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>

          <main className="content-wrapper">
            <header className="page-header">
              <h1>
                Resource <span>Center</span>
              </h1>
              <p>Explore our curated collection of guides, articles, and tools to help you master your interviews and advance your career.</p>
            </header>
            <section>
              <div className="resources-grid">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default ResourcesPage;