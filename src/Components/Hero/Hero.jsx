import React from 'react'
import './Hero.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FlowAnimation from './FlowAnimation';

function Hero() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <div className="hero-container">
        <div className="hero-left">
          <FlowAnimation />
        </div>
        <div className='hero-right'>
          <h1>Automate the work that slows your business down.</h1>
          <h3>We design custom AI systems that answer customers, manage workflows, and scale operations — without adding headcount.</h3>
          <div className="hero-actions">
            <Link to="/book-demo">
              <button>Get a Free Automation Plan</button>
            </Link>
            <button onClick={() => scrollToSection('learn-more')}>See Use Cases</button>
          </div>  
        </div>
      </div>
      <hr className='hero_hr'/>
    </>
  )
}

export default Hero