import React from 'react'
import './TermsOfService.css'

function TermsOfService() {
  return (
    <div className='terms-wrapper'>
      <div className='terms-container'>
        {/* Header */}
        <div className='terms-header'>
          <h1>Terms of Service</h1>
          <p className='terms-subtitle'>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Main Content Card */}
        <div className='terms-card'>
          {/* Agreement */}
          <div className='terms-section'>
            <div className='terms-icon-header'>
              <div className='terms-icon'>📋</div>
              <h2>Agreement to Terms</h2>
            </div>
            <p className='terms-text'>
              By using MordecAI services, you agree to receive service-related communications, including SMS messages where applicable. These terms govern your use of our AI-powered customer support and communication services.
            </p>
          </div>

          <div className='terms-divider'></div>

          {/* SMS Communications */}
          <div className='terms-section'>
            <div className='terms-icon-header'>
              <div className='terms-icon'>📱</div>
              <h2>SMS Communications</h2>
            </div>
            <p className='terms-text'>
              When you provide your phone number to MordecAI or a participating business:
            </p>
            <ul className='terms-list'>
              <li>You consent to receive service-related SMS messages</li>
              <li>Message frequency varies based on your interactions</li>
              <li>Message and data rates may apply from your carrier</li>
              <li>You can reply <strong>STOP</strong> at any time to opt out</li>
              <li>Reply <strong>HELP</strong> for assistance with our services</li>
            </ul>
          </div>

          <div className='terms-divider'></div>

          {/* Service Description */}
          <div className='terms-section'>
            <div className='terms-icon-header'>
              <div className='terms-icon'>🤖</div>
              <h2>Service Description</h2>
            </div>
            <p className='terms-text'>
              MordecAI provides AI-powered phone answering and customer communication services on behalf of participating businesses. Our services include:
            </p>
            <ul className='terms-list'>
              <li>Automated phone call handling and responses</li>
              <li>Missed-call follow-up messages</li>
              <li>Reservation and order confirmations</li>
              <li>Customer support communications</li>
            </ul>
          </div>

          <div className='terms-divider'></div>

          {/* Service "As Is" */}
          <div className='terms-section'>
            <div className='terms-icon-header'>
              <div className='terms-icon'>⚠️</div>
              <h2>Service Disclaimer</h2>
            </div>
            <p className='terms-text'>
              MordecAI provides services <strong>"as is"</strong> without warranties of any kind, either express or implied. We do not guarantee uninterrupted or error-free service. We are not liable for any damages resulting from use of our services.
            </p>
          </div>

          <div className='terms-divider'></div>

          {/* User Responsibilities */}
          <div className='terms-section'>
            <div className='terms-icon-header'>
              <div className='terms-icon'>👤</div>
              <h2>Your Responsibilities</h2>
            </div>
            <p className='terms-text'>
              As a user of MordecAI services, you agree to:
            </p>
            <ul className='terms-list'>
              <li>Provide accurate contact information</li>
              <li>Use services only for lawful purposes</li>
              <li>Not abuse or misuse our communication systems</li>
              <li>Respect the businesses we serve on your behalf</li>
            </ul>
          </div>

          <div className='terms-divider'></div>

          {/* Changes to Terms */}
          <div className='terms-section'>
            <div className='terms-icon-header'>
              <div className='terms-icon'>🔄</div>
              <h2>Changes to Terms</h2>
            </div>
            <p className='terms-text'>
              We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms. We will notify users of significant changes when possible.
            </p>
          </div>

          <div className='terms-divider'></div>

          {/* Contact */}
          <div className='terms-section'>
            <div className='terms-icon-header'>
              <div className='terms-icon'>📧</div>
              <h2>Contact Us</h2>
            </div>
            <p className='terms-text'>
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className='terms-contact'>
              <a href="mailto:support@getmordecai.com">mordecaiteam@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService