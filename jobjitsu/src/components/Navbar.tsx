"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Using X for the close icon

// The `Link` and `Image` components from Next.js are not available in this environment.
// We'll use standard `a` and `img` tags instead.
const Link = (props) => <a {...props}>{props.children}</a>;
const Image = (props) => <img {...props} />;

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Effect to detect if the user has scrolled down the page
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap');
        
        :root {
          --background: #0a0a0a;
          --foreground: #fafafa;
          --primary: #ff0000;
          --accent: #cc0000;
          --card: #1a1a1a;
          --border: #2a2a2a;
          --muted-foreground: #999999;
        }

        .navbar-body, .navbar-body * {
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }

        .nav-container {
          position: fixed;
          width: 100%;
          top: 0;
          left: 0;
          z-index: 50;
          transition: background-color 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease;
        }

        .nav-container.scrolled {
          background-color: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }

        .nav-content {
          max-width: 1200px;
          margin: auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          color: var(--foreground);
          font-weight: 600;
          font-size: 1.25rem;
          text-decoration: none;
        }
        .nav-logo img {
          height: 75px; /* Adjusted logo size */
          width: auto;
          margin-right: 0.5rem;
        }

        .nav-links-desktop {
          display: none; /* Hidden on mobile */
          align-items: center;
          gap: 2rem;
        }
        @media (min-width: 768px) {
            .nav-links-desktop {
                display: flex;
            }
        }

        .nav-link {
          color: var(--muted-foreground);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--primary);
        }

        .primary-btn-nav {
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: 9999px;
          background: linear-gradient(to right, var(--accent), var(--primary));
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
          text-decoration: none;
        }
        .primary-btn-nav:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.3);
        }

        .mobile-menu-button {
          display: block; /* Shown on mobile */
          background: transparent;
          border: none;
          color: var(--foreground);
          cursor: pointer;
          z-index: 60;
        }
        @media (min-width: 768px) {
            .mobile-menu-button {
                display: none;
            }
        }
        
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--background);
          z-index: 55;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
        }
        .mobile-menu.open {
          transform: translateX(0);
        }
        .mobile-menu .nav-link {
          font-size: 1.5rem;
          color: var(--foreground);
        }
      `}</style>
      <div className="navbar-body">
        <nav className={`nav-container ${hasScrolled ? "scrolled" : ""}`}>
          <div className="nav-content">
            <Link href="/" className="nav-logo">
              <Image
                src="logo.png"
                alt="JobJitsu Logo"
              />
            </Link>

            <div className="nav-links-desktop">
              <Link href="/questions" className="nav-link">Questions</Link>
              <Link href="/features" className="nav-link">Features</Link>
              <Link href="/pricing" className="nav-link">Pricing</Link>
              <Link href="/faq" className="nav-link">FAQ</Link>
              <Link href="/resources" className="nav-link">Resources</Link>
              <Link href="/practice" className="nav-link">Practice</Link>
              <Link href="/profile" className="nav-link">Profile</Link>
            </div>
            
            <div className="hidden md:block">
              <Link href="/signin" className="primary-btn-nav">Try for free &rarr;</Link>
            </div>

            <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
            <Link href="/questions" className="nav-link" onClick={() => setIsMenuOpen(false)}>Questions</Link>
            <Link href="/features" className="nav-link" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="nav-link" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
            <Link href="/faq" className="nav-link" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
            <Link href="/resources" className="nav-link" onClick={() => setIsMenuOpen(false)}>Resources</Link>
            <Link href="/practice" className="nav-link" onClick={() => setIsMenuOpen(false)}>Practice</Link>
            <Link href="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
            <Link href="/signin" className="primary-btn-nav" style={{marginTop: '2rem'}} onClick={() => setIsMenuOpen(false)}>Try for free &rarr;</Link>
        </div>
      </div>
    </>
  );
}

