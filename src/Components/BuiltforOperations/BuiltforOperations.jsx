import React from 'react';
import './BuiltforOperations.css';
import { Link } from 'react-router-dom';

const BuiltForRealOperations = () => {
  return (
    <section className="operations-section">
      <div className="operations-container">
        <div className="operations-header">
          <h2 className="operations-title">
            Built for Real Operations
          </h2>
          <p className="operations-subtitle">
            MordecAI isn't designed to replace your staff or overhaul how you run your business.
            It's built to quietly handle the repetitive front-desk tasks that pull attention away from service — especially during busy hours.
          </p>
        </div>

        <div className="operations-focus">
          <h3 className="focus-heading">
            We focus on:
          </h3>
          <div className="focus-grid">
            <div className="focus-card">
              <div className="focus-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m5.2-13.2L14 8.3m-1.7 7.5-3.2 3.2m10.2-7.8L16 14.4m-7.5 1.7-3.2-3.2m13.2 5.2h-6m-6 0H1"></path>
                </svg>
              </div>
              <h4 className="card-title">
                Reliability over flash
              </h4>
            </div>

            <div className="focus-card">
              <div className="focus-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"></path>
                </svg>
              </div>
              <h4 className="card-title">
                Clear workflows over complexity
              </h4>
            </div>

            <div className="focus-card">
              <div className="focus-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h4 className="card-title">
                Automation that supports your team, not disrupts it
              </h4>
            </div>
          </div>
        </div>

        <div className="operations-footer">
          <p className="footer-text">
            Every system is tailored to how your business actually operates today, with room to grow over time.
          </p>
          <p className="footer-text">
            <span className="highlight">No rigid setups.</span>{' '}
            <span className="highlight">No unnecessary features.</span>{' '}
            Just practical automation that works in the background.
          </p>
        </div>

        <div className="operations-cta">
          <h3 className="cta-heading">
            Ready to see how this would work in your restaurant?
          </h3>
          <Link to="/book-demo">
          <button className="cta-button">
            Book a Free Walkthrough
            <svg className="cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BuiltForRealOperations;