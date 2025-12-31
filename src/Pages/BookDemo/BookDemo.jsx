import React, { useState } from 'react'
import './BookDemo.css'

function BookDemo() {
  const [formData, setFormData] = useState({
    fullName: '',
    restaurantName: '',
    phone: '',
    email: '',
    location: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '03951ed6-b0cb-4321-870b-a66256cb693b',
          name: formData.fullName,
          restaurant: formData.restaurantName,
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          message: formData.notes,
          subject: `New Demo Request from ${formData.restaurantName}`
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({
          fullName: '',
          restaurantName: '',
          phone: '',
          email: '',
          location: '',
          notes: ''
        });
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='BookDemo-wrapper'>
      <div className='BookDemo-container'>
        <div className='BookDemo-header'>
          <h1 className='BookDemo-title'>Let's Walk Through Your Front Desk Together</h1>
          <p className='BookDemo-subtitle'>
            30-minute personalized walkthrough • No commitment required • Free consultation
          </p>
        </div>

        <div className='BookDemo-content'>
          <div className='BookDemo-info'>
            <div className='info-section'>
              <h2 className='info-heading'>On This Call, We'll:</h2>
              <ul className='info-list'>
                <li>Review how your phones and reservations are handled today</li>
                <li>Identify where calls are being missed or staff gets interrupted</li>
                <li>Walk through what MordecAI could automate right now</li>
                <li>Answer any questions about setup, pricing, or integrations</li>
              </ul>
            </div>

            <div className='fit-card fit-good'>
              <div className='fit-header'>
                <div className='fit-icon fit-icon-good'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>This is a Good Fit If You:</h3>
              </div>
              <ul>
                <li>Receive frequent phone calls during service</li>
                <li>Take reservations or pickup orders by phone</li>
                <li>Want fewer interruptions during rush hours</li>
              </ul>
            </div>

            <div className='fit-card fit-not'>
              <div className='fit-header'>
                <div className='fit-icon fit-icon-not'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <h3>This is NOT a Good Fit If You:</h3>
              </div>
              <ul>
                <li>Never receive phone calls</li>
                <li>Are looking for AI to fully replace staff</li>
                <li>Want a plug-and-play app with no customization</li>
              </ul>
            </div>
          </div>

          <div className='BookDemo-form-container'>
            <form className='BookDemo-form' onSubmit={handleSubmit}>
              <h2 className='form-heading'>Book Your Free Walkthrough</h2>
              
              {submitStatus === 'success' && (
                <div className='alert alert-success'>
                  <strong>✓ Success!</strong> Thanks for reaching out. We'll contact you within 24 hours to schedule your free walkthrough.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className='alert alert-error'>
                  <strong>✕ Oops!</strong> Something went wrong. Please try again or email us directly at mordecaiteam@gmail.com
                </div>
              )}

              <div className='form-group'>
                <label htmlFor='fullName'>Full Name *</label>
                <input 
                  type="text" 
                  id='fullName'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='John Smith'
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='restaurantName'>Restaurant Name *</label>
                <input 
                  type="text" 
                  id='restaurantName'
                  name='restaurantName'
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder='Your Restaurant Name'
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='phone'>Phone Number *</label>
                <input 
                  type="tel" 
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='(555) 123-4567'
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email *</label>
                <input 
                  type="email" 
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='you@restaurant.com'
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='location'>City / State *</label>
                <input 
                  type="text" 
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='New York, NY'
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='notes'>Anything you'd like us to know before the call?</label>
                <textarea 
                  id='notes'
                  name='notes'
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder='Tell us about your current setup, challenges, or specific questions...'
                  rows='4'
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button 
                type='submit' 
                className='BookDemo-submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span>Sending...</span>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </>
                ) : (
                  <>
                    Book My Free Walkthrough
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>

              <p className='form-footer'>
                We'll reach out within 24 hours to schedule your call
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDemo