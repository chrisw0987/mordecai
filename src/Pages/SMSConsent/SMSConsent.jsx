import React from 'react'
import './SMSConsent.css'
import { Link } from 'react-router-dom'

function SMSConsent() {
  return (
    <div className='sms-consent-wrapper'>
      <div className='sms-consent-container'>
        {/* Header */}
        <div className='sms-consent-header'>
          <h1>SMS Program Disclosure</h1>
          <p className='sms-consent-subtitle'>
            Transparent communication is important to us
          </p>
        </div>

        {/* Main Content Card */}
        <div className='sms-consent-card'>
          {/* Consent Agreement Section */}
          <div className='sms-section'>
            <div className='sms-icon-header'>
              <div className='sms-icon'>📱</div>
              <h2>Your Consent</h2>
            </div>
            <p className='sms-description'>
              By providing your phone number, you agree to receive text messages from MordecAI related to customer support, missed-call follow-ups, order or reservation confirmations, and service-related updates on behalf of participating businesses.
            </p>
          </div>

          <div className='sms-divider'></div>

          {/* Important Information */}
          <div className='sms-section'>
            <div className='sms-icon-header'>
              <div className='sms-icon'>ℹ️</div>
              <h2>Important Information</h2>
            </div>
            <div className='sms-info-grid'>
              <div className='sms-info-item'>
                <strong>Message Frequency:</strong>
                <span>Varies based on your interactions</span>
              </div>
              <div className='sms-info-item'>
                <strong>Carrier Charges:</strong>
                <span>Message and data rates may apply</span>
              </div>
            </div>
          </div>

          <div className='sms-divider'></div>

          {/* Opt-Out Section */}
          <div className='sms-section'>
            <div className='sms-icon-header'>
              <div className='sms-icon'>✋</div>
              <h2>Your Control</h2>
            </div>
            <p className='sms-description'>
              You can reply <strong>STOP</strong> at any time to opt out of text messages.
            </p>
            <p className='sms-description'>
              Reply <strong>HELP</strong> for assistance with our SMS program.
            </p>
          </div>

          <div className='sms-divider'></div>

          {/* Opt-In Methods */}
          <div className='sms-section'>
            <div className='sms-icon-header'>
              <div className='sms-icon'>📝</div>
              <h2>How You Opt In</h2>
            </div>
            <p className='sms-description'>Users may opt in by:</p>
            <ul className='sms-list'>
              <li>Submitting their phone number through a MordecAI-powered phone call</li>
              <li>Requesting a text follow-up after calling a participating business</li>
            </ul>
          </div>

          <div className='sms-divider'></div>

          {/* Legal Links */}
          <div className='sms-section sms-legal'>
            <div className='sms-legal-links'>
              <Link to="/privacy" className='sms-legal-link'>
                Privacy Policy
              </Link>
              <span className='sms-legal-separator'>•</span>
              <Link to="/terms" className='sms-legal-link'>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className='sms-footer-note'>
          <p>
            Questions about our SMS program? Contact us at{' '}
            <a href="mailto:support@getmordecai.com">mordecaiteam@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SMSConsent