import React from 'react';

// Define a type for our pricing plan
type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  buttonText: string;
};

// Data for the pricing tiers
const pricingPlans: PricingPlan[] = [
  {
    name: 'Basic',
    price: '$0',
    period: '/ forever',
    description: 'For individuals just getting started and wanting to try out the platform.',
    features: [
      'Access to 5 AI interviews per month',
      'Basic performance feedback',
      'Standard question library',
      'Email support',
    ],
    buttonText: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/ month',
    description: 'For job seekers who want to seriously prepare and land their dream job.',
    features: [
      'Unlimited AI interviews',
      'Advanced performance feedback',
      'Full question library',
      'In-depth analytics and tracking',
      'Priority email support',
    ],
    isFeatured: true,
    buttonText: 'Upgrade Now',
  },
  {
    name: 'Premium',
    price: '$29',
    period: '/ month',
    description: 'For professionals aiming for top-tier roles and comprehensive preparation.',
    features: [
      'All features in Pro',
      'Live mock interviews with experts',
      'Personalized career coaching',
      'Resume and cover letter review',
      '24/7 dedicated support',
    ],
    buttonText: 'Choose Premium',
  },
];

// [New] Component for a single pricing card
const PricingCard = ({ plan }: { plan: PricingPlan }) => {
  const isFeatured = plan.isFeatured || false;
  return (
    <div className={`pricing-card ${isFeatured ? 'featured' : ''}`}>
      {isFeatured && <div className="featured-badge">Most Popular</div>}
      <div className="plan-header">
        <h3 className="plan-name">{plan.name}</h3>
        <p className="plan-description">{plan.description}</p>
        <div className="plan-price">
          {plan.price}
          <span className="plan-period">{plan.period}</span>
        </div>
      </div>
      <ul className="features-list">
        {plan.features.map((feature, index) => (
          <li key={index}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feature-checkmark">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a href="#" className={`cta-button ${isFeatured ? 'primary' : 'secondary'}`}>
        {plan.buttonText}
      </a>
    </div>
  );
};

// [New] Main page component with modern styling
const PricingPage = () => {
  return (
    <>
      {/* Self-contained styles for the pricing page */}
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

        .pricing-page-body, .pricing-page-body * {
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .pricing-container {
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
          opacity: 0.1;
          z-index: 0;
          animation: pulse 25s infinite alternate;
        }
        .shape1 {
          width: 600px; height: 600px;
          background: var(--primary);
          top: -200px; left: -200px;
        }
        .shape2 {
          width: 500px; height: 500px;
          background: #4a00ff; /* A different color for variety */
          bottom: -250px; right: -250px;
          animation-delay: 5s;
        }
        @keyframes pulse {
          0% { transform: scale(0.9) rotate(-10deg); }
          100% { transform: scale(1.1) rotate(10deg); }
        }

        .content-wrapper {
          max-width: 1200px;
          margin: auto;
          padding: 6rem 1.5rem 5rem;
          position: relative;
          z-index: 1;
        }
        
        /* Page Header */
        .page-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .page-header h1 {
          font-size: 3rem; font-weight: 800; line-height: 1.1; margin-bottom: 1rem;
        }
        .page-header h1 span { color: var(--primary); }
        .page-header p {
          font-size: 1.125rem; color: var(--muted-foreground); max-width: 600px; margin: auto;
        }
        @media (min-width: 768px) { .page-header h1 { font-size: 4rem; } }
        
        /* Pricing Grid */
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .pricing-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* Pricing Card */
        .pricing-card {
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
          position: relative;
        }
        .pricing-card.featured {
          border-color: var(--primary);
          transform: scale(1.05);
          box-shadow: 0 10px 50px -10px rgba(255, 0, 0, 0.2);
        }
        @media (max-width: 1023px) {
          .pricing-card.featured { transform: scale(1); }
        }

        .featured-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(to right, var(--accent), var(--primary));
          color: white;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .plan-header { text-align: center; }
        .plan-name { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75rem; }
        .plan-description { color: var(--muted-foreground); min-height: 4.5rem; margin-bottom: 1.5rem; }
        .plan-price { font-size: 3.5rem; font-weight: 800; margin-bottom: 2rem; }
        .plan-period { font-size: 1rem; color: var(--muted-foreground); font-weight: 500; }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          flex-grow: 1;
        }
        .features-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        .feature-checkmark { color: var(--primary); }
        
        /* Buttons */
        .cta-button {
          display: block;
          width: 100%;
          padding: 0.875rem;
          border-radius: 8px;
          text-align: center;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .cta-button.primary {
          background: linear-gradient(to right, var(--accent), var(--primary));
          color: white;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
        }
        .cta-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.3);
        }
        .cta-button.secondary {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--foreground);
        }
        .cta-button.secondary:hover {
          background-color: var(--border);
          border-color: var(--primary);
        }
      `}</style>
      <div className="pricing-page-body">
        <div className="pricing-container">
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>

          <main className="content-wrapper">
            <header className="page-header">
              <h1>
                Flexible <span>Pricing</span>
              </h1>
              <p>Choose the perfect plan to fit your needs. Start for free and upgrade whenever you're ready to accelerate your career.</p>
            </header>
            <section>
              <div className="pricing-grid">
                {pricingPlans.map((plan) => (
                  <PricingCard key={plan.name} plan={plan} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default PricingPage;