import React from 'react';
import './WhoThisIsFor.css';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function WhoThisIsFor() {
  return (
    <>
      <div className='who-this-is-for-container'>
        <h1 className='who-title'>Is MordecAI Right for You?</h1>
        <p className='who-subtitle'>
          We believe in being upfront about who we can help — and who we can't.
        </p>

        <div className='who-columns'>
          <div className='who-column great-fit'>
            <div className='column-header'>
              <div className='header-icon great-fit-icon'>
                <Check size={32} strokeWidth={3} />
              </div>
              <h2>MordecAI is a great fit if you:</h2>
            </div>
            
            <ul className='who-list'>
              <li>
                <div className='list-icon great-fit-check'>
                  <Check size={20} strokeWidth={3} />
                </div>
                <span>Get frequent phone calls during service</span>
              </li>
              <li>
                <div className='list-icon great-fit-check'>
                  <Check size={20} strokeWidth={3} />
                </div>
                <span>Take reservations or pickup orders by phone</span>
              </li>
              <li>
                <div className='list-icon great-fit-check'>
                  <Check size={20} strokeWidth={3} />
                </div>
                <span>Want fewer interruptions during rush hours</span>
              </li>
            </ul>
          </div>

          <div className='who-column not-fit'>
            <div className='column-header'>
              <div className='header-icon not-fit-icon'>
                <X size={32} strokeWidth={3} />
              </div>
              <h2>MordecAI may not be a fit if you:</h2>
            </div>
            
            <ul className='who-list'>
              <li>
                <div className='list-icon not-fit-x'>
                  <X size={20} strokeWidth={3} />
                </div>
                <span>Never receive phone calls</span>
              </li>
              <li>
                <div className='list-icon not-fit-x'>
                  <X size={20} strokeWidth={3} />
                </div>
                <span>Already have fully automated call handling</span>
              </li>
              <li>
                <div className='list-icon not-fit-x'>
                  <X size={20} strokeWidth={3} />
                </div>
                <span>Want AI to replace staff entirely</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='who-footer'>
          <p>Not sure if you're a fit? <Link to='/book-demo'>Let's talk </Link> — we'll help you figure it out.</p>
        </div>
      </div>
    </>
  );
}

export default WhoThisIsFor;