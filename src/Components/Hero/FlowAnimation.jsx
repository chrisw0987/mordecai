import React from 'react';
import './FlowAnimation.css';

function FlowAnimation() {
  return (
    <div className="flow-container">
      <div className="flow-step">
        <div className="flow-icon">📞</div>
        <div className="flow-label">Incoming Call</div>
      </div>

      <div className="flow-connector"></div>

      <div className="flow-step flow-highlight">
        <div className="flow-icon">🤖</div>
        <div className="flow-label">MordecAI Answers</div>
      </div>

      <div className="flow-connector"></div>

      <div className="flow-step">
        <div className="flow-icon">📅</div>
        <div className="flow-label">Reservation Confirmed</div>
      </div>

      <div className="flow-connector"></div>

      <div className="flow-step">
        <div className="flow-icon">🍽️</div>
        <div className="flow-label">Staff Focused on Guests</div>
      </div>
    </div>
  );
}

export default FlowAnimation;