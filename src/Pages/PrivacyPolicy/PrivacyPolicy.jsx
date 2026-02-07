import React from 'react'
import './PrivacyPolicy.css'

function PrivacyPolicy() {
  return (
    <div className='privacy-wrapper'>
      <div className='privacy-container'>
        {/* Header */}
        <div className='privacy-header'>
          <h1>Privacy Policy</h1>
          <p className='privacy-subtitle'>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Main Content Card */}
        <div className='privacy-card'>
          {/* Information Collection */}
          <div className='privacy-section'>
            <div className='privacy-icon-header'>
              <div className='privacy-icon'>🔒</div>
              <h2>Information We Collect</h2>
            </div>
            <p className='privacy-text'>
              MordecAI collects phone numbers and related information solely to provide customer support, missed-call follow-ups, and service-related messages on behalf of participating businesses.
            </p>
          </div>

          <div className='privacy-divider'></div>

          {/* Data Usage */}
          <div className='privacy-section'>
            <div className='privacy-icon-header'>
              <div className='privacy-icon'>📊</div>
              <h2>How We Use Your Information</h2>
            </div>
            <p className='privacy-text'>
              We use the information we collect to:
            </p>
            <ul className='privacy-list'>
              <li>Provide customer support and service communications</li>
              <li>Send missed-call follow-ups on behalf of businesses</li>
              <li>Deliver reservation confirmations and order updates</li>
              <li>Improve our AI-powered phone services</li>
            </ul>
          </div>

          <div className='privacy-divider'></div>

          {/* Data Sharing */}
          <div className='privacy-section'>
            <div className='privacy-icon-header'>
              <div className='privacy-icon'>🛡️</div>
              <h2>Data Sharing & Protection</h2>
            </div>
            <p className='privacy-text'>
              We do not sell or share personal information with third parties except as required to deliver our services. Your information may be shared with the business you contacted to facilitate customer service.
            </p>
            <p className='privacy-text'>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
            </p>
          </div>

          <div className='privacy-divider'></div>

          {/* Your Rights */}
          <div className='privacy-section'>
            <div className='privacy-icon-header'>
              <div className='privacy-icon'>✅</div>
              <h2>Your Rights</h2>
            </div>
            <p className='privacy-text'>
              You have the right to:
            </p>
            <ul className='privacy-list'>
              <li>Opt out of SMS messages by replying STOP at any time</li>
              <li>Request access to your personal information</li>
              <li>Request deletion of your data</li>
              <li>Ask questions about how your data is used</li>
            </ul>
          </div>

          <div className='privacy-divider'></div>

          {/* Contact */}
          <div className='privacy-section'>
            <div className='privacy-icon-header'>
              <div className='privacy-icon'>📧</div>
              <h2>Contact Us</h2>
            </div>
            <p className='privacy-text'>
              For questions about this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <p className='privacy-contact'>
              <a href="mailto:support@getmordecai.com">mordecaiteam@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy