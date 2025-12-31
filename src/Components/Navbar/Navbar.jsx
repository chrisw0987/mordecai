import React, { useState } from 'react'
import logo from '../../assets/MordecAI-logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    // Close mobile menu when a link is clicked
    setIsMenuOpen(false);
    
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className='navbar_container'>
        <Link to="/">
          <img className="logo" src={logo} alt="MordecAI Logo" />
        </Link>
        
        <ul className='navbar_links'>
          <li>
            <a onClick={() => scrollToSection('home')}>Home</a>
          </li>
          <li>
            <a onClick={() => scrollToSection('about')}>About</a>
          </li>
          <li>
            <a onClick={() => scrollToSection('learn-more')}>Learn More</a>
          </li>
          <li>
            <a onClick={() => scrollToSection('contact')}>Contact Us</a>
          </li>
        </ul>
        
        <Link to="/book-demo">
          <button className='navbar_button'>Book A Demo</button>
        </Link>

        <button className='menu_toggle' onClick={toggleMenu} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
      </div>

      <hr />

      <div 
        className={`mobile_menu_overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
      />

      <div className={`mobile_menu ${isMenuOpen ? 'open' : ''}`}>
        <div className='mobile_menu_header'>
          <img className="logo" src={logo} alt="MordecAI Logo" />
          <button 
            className='mobile_menu_close' 
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <ul className='mobile_menu_links'>
          <li>
            <a onClick={() => scrollToSection('home')}>Home</a>
          </li>
          <li>
            <a onClick={() => scrollToSection('about')}>About</a>
          </li>
          <li>
            <a onClick={() => scrollToSection('learn-more')}>Learn More</a>
          </li>
          <li>
            <a onClick={() => scrollToSection('contact')}>Contact Us</a>
          </li>
        </ul>

        <Link to="/book-demo" onClick={() => setIsMenuOpen(false)}>
          <button className='navbar_button mobile_menu_button'>Book A Demo</button>
        </Link>
      </div>
      <hr className='navbar-hr'/>
    </>
  )
}

export default Navbar