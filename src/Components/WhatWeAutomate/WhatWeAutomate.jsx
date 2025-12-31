import React from 'react';
import './WhatWeAutomate.css';
import { Phone, Calendar, ShoppingBag, MessageCircle, ArrowRightLeft, TrendingUp } from 'lucide-react';

function WhatWeAutomate() {
  return (
    <>
      <div className='what-we-automate-container'>
        <h1 className='automate-title'>What We Automate</h1>
        <p className='automate-subtitle'>
          From phone calls to reservations, MordecAI handles the repetitive tasks so your team can focus on hospitality.
        </p>

        <div className='automate-grid'>
          <div className='automate-card'>
            <div className='automate-icon'>
              <Phone size={40} strokeWidth={2} />
            </div>
            <h3>Incoming Calls & Missed Calls</h3>
            <p className='automate-description'>
              MordecAI answers every call instantly — no hold music, no missed reservations.
            </p>
            <ul className='automate-subpoints'>
              <li>Reservations</li>
              <li>Pickup orders</li>
              <li>General questions</li>
            </ul>
          </div>

          <div className='automate-card'>
            <div className='automate-icon'>
              <Calendar size={40} strokeWidth={2} />
            </div>
            <h3>Reservations & Availability</h3>
            <p className='automate-description'>
              Automatically handles booking, confirmations, and availability checks.
            </p>
            <ul className='automate-subpoints'>
              <li>Supports same-time reservations</li>
              <li>Calendar-based scheduling</li>
              <li>Confirmation via email (SMS optional later)</li>
            </ul>
          </div>

          <div className='automate-card'>
            <div className='automate-icon'>
              <ShoppingBag size={40} strokeWidth={2} />
            </div>
            <h3>Pickup Order Intake</h3>
            <p className='automate-description'>
              Takes pickup orders accurately, reads them back, and confirms details.
            </p>
            <ul className='automate-subpoints'>
              <li>Item-by-item order capture</li>
              <li>Special instructions</li>
              <li>Estimated pickup times</li>
            </ul>
          </div>

          <div className='automate-card'>
            <div className='automate-icon'>
              <MessageCircle size={40} strokeWidth={2} />
            </div>
            <h3>Customer Questions</h3>
            <p className='automate-description'>
              Answers common questions so staff can focus on service.
            </p>
            <ul className='automate-subpoints'>
              <li>Menu questions</li>
              <li>Hours & directions</li>
              <li>Basic policies</li>
            </ul>
          </div>

          <div className='automate-card'>
            <div className='automate-icon'>
              <ArrowRightLeft size={40} strokeWidth={2} />
            </div>
            <h3>Staff Escalation</h3>
            <p className='automate-description'>
              Knows when to hand off to a human — without frustrating the customer.
            </p>
            <ul className='automate-subpoints'>
              <li>Transfers calls when needed</li>
              <li>Takes messages if staff is unavailable</li>
            </ul>
          </div>

          <div className='automate-card'>
            <div className='automate-icon'>
              <TrendingUp size={40} strokeWidth={2} />
            </div>
            <h3>Continuous Improvement</h3>
            <p className='automate-description'>
              The system improves over time as your business evolves.
            </p>
            <ul className='automate-subpoints'>
              <li>Workflow tuning</li>
              <li>New automations added</li>
              <li>Expands beyond phones</li>
            </ul>
          </div>
        </div>
      </div>
      <hr className='Whatweautomate_hr'/>
    </>
  );
}

export default WhatWeAutomate;