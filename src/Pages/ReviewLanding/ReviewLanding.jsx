import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../supabase'
import './ReviewLanding.css'

function ReviewLanding() {
  const { token } = useParams()

  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [step, setStep] = useState('loading')
  const [feedback, setFeedback] = useState('')
  const [logoFailed, setLogoFailed] = useState(false)

  const [reviewRequest, setReviewRequest] = useState(null)
  const [businessConfig, setBusinessConfig] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadReviewPage = async () => {
      if (!token) {
        setErrorMessage('Invalid review link.')
        setStep('error')
        return
      }

      const { data: reviewData, error: reviewError } = await supabase
        .from('review_requests')
        .select('id, business_id, review_url_token, clicked_at')
        .eq('review_url_token', token)
        .maybeSingle()

      if (reviewError || !reviewData) {
        setErrorMessage('This review link is invalid or has expired.')
        setStep('error')
        return
      }

      setReviewRequest(reviewData)

      if (!reviewData.clicked_at) {
        await supabase
          .from('review_requests')
          .update({
            clicked_at: new Date().toISOString()
          })
          .eq('id', reviewData.id)
      }

      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, logo_url, primary_color, google_review_url')
        .eq('id', reviewData.business_id)
        .maybeSingle()

      if (businessError || !businessData) {
        setErrorMessage('Could not load business details.')
        setStep('error')
        return
      }

      setBusinessConfig({
        name: businessData.name || 'Business',
        logo: businessData.logo_url || '',
        primaryColor: businessData.primary_color || '#7B5FC6',
        googleReviewUrl: businessData.google_review_url || ''
      })

      const { data: existingFeedback } = await supabase
        .from('review_feedback')
        .select('rating, feedback')
        .eq('review_request_id', reviewData.id)
        .maybeSingle()

      if (existingFeedback?.rating >= 4) {
        setSelectedRating(existingFeedback.rating)
        setFeedback(existingFeedback.feedback || '')
        setStep('positive')
      } else if (existingFeedback?.rating >= 1 && existingFeedback?.rating <= 3) {
        setSelectedRating(existingFeedback.rating)
        setFeedback(existingFeedback.feedback || '')
        setStep(existingFeedback.feedback ? 'submitted' : 'negative')
      } else {
        setStep('rating')
      }
    }

    loadReviewPage()
  }, [token])

  const upsertFeedback = async ({ rating, feedbackText = null }) => {
    if (!reviewRequest) return { error: new Error('Missing review request') }

    return await supabase
      .from('review_feedback')
      .upsert(
        {
          review_request_id: reviewRequest.id,
          business_id: reviewRequest.business_id,
          rating,
          feedback: feedbackText,
          submitted_at: new Date().toISOString()
        },
        { onConflict: 'review_request_id' }
      )
  }

  const handleStarClick = async (rating) => {
    setSelectedRating(rating)

    const { error } = await upsertFeedback({ rating })

    if (error) {
      setErrorMessage('Could not save your rating. Please try again.')
      return
    }

    if (rating >= 4) {
      setStep('positive')
    } else {
      setStep('negative')
    }
  }

  const handleBack = async () => {
    setStep('rating')
    setSelectedRating(0)
    setHoveredRating(0)
    setFeedback('')

    if (!reviewRequest) return

    await supabase
      .from('review_feedback')
      .delete()
      .eq('review_request_id', reviewRequest.id)
  }

  const handleFeedbackSubmit = async () => {
    if (!selectedRating || selectedRating >= 4) return

    const { error } = await upsertFeedback({
      rating: selectedRating,
      feedbackText: feedback
    })

    if (error) {
      setErrorMessage('Could not submit feedback. Please try again.')
      return
    }

    setStep('submitted')
  }

  const handleGoogleReviewRedirect = async () => {
    if (!selectedRating || selectedRating < 4) return
    if (!businessConfig?.googleReviewUrl) {
      setErrorMessage('Google review link is not set for this business yet.')
      return
    }

    const { error } = await upsertFeedback({
      rating: selectedRating,
      feedbackText: null
    })

    if (error) {
      setErrorMessage('Could not continue to Google review.')
      return
    }

    window.location.href = businessConfig.googleReviewUrl
  }

  if (step === 'loading') {
    return (
      <div className='review-wrapper'>
        <div className='review-container'>
          <div className='review-card'>
            <h1 className='review-headline'>Loading review page...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className='review-wrapper'>
        <div className='review-container'>
          <div className='review-card'>
            <h1 className='review-headline'>Oops</h1>
            <p className='review-supporting-text'>{errorMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='review-wrapper'>
      <div className='review-container'>
        <div className='review-card'>
          <div className='business-logo'>
            {!logoFailed && businessConfig?.logo ? (
              <img
                src={businessConfig.logo}
                alt={`${businessConfig.name} logo`}
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className='logo-fallback'>
                {businessConfig?.name?.charAt(0) || 'B'}
              </div>
            )}
          </div>

          <h2 className='business-name'>{businessConfig?.name}</h2>

          {step === 'rating' && (
            <>
              <h1 className='review-headline'>How was your experience today?</h1>

              <p className='review-supporting-text'>
                We'd love your feedback. It only takes a few seconds.
              </p>

              <div className='star-rating'>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= (hoveredRating || selectedRating)

                  return (
                    <button
                      key={star}
                      type='button'
                      className={`star-button ${isActive ? 'active' : ''}`}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <svg viewBox='0 0 24 24' className='star-icon'>
                        <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                      </svg>
                    </button>
                  )
                })}
              </div>

              <p className='reassurance-text'>
                Your feedback helps us improve.
              </p>
            </>
          )}

          {step === 'positive' && (
            <>
              <h1 className='review-headline'>Thanks so much for your support!</h1>

              <p className='review-supporting-text'>
                Would you mind leaving us a quick Google review?
              </p>

              <div className='button-row'>
                <button className='secondary-button' onClick={handleBack}>
                  Change Rating
                </button>

                <button
                  className='primary-button'
                  style={{ backgroundColor: businessConfig?.primaryColor || '#7B5FC6' }}
                  onClick={handleGoogleReviewRedirect}
                >
                  Leave a Google Review
                </button>
              </div>
            </>
          )}

          {step === 'negative' && (
            <>
              <h1 className='review-headline'>We're sorry to hear that</h1>

              <p className='review-supporting-text'>
                Please tell us what happened so we can improve.
              </p>

              <textarea
                className='feedback-input'
                placeholder='Your feedback...'
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <div className='button-row'>
                <button className='secondary-button' onClick={handleBack}>
                  Change Rating
                </button>

                <button
                  className='primary-button'
                  style={{ backgroundColor: businessConfig?.primaryColor || '#7B5FC6' }}
                  onClick={handleFeedbackSubmit}
                >
                  Send Feedback
                </button>
              </div>
            </>
          )}

          {step === 'submitted' && (
            <>
              <h1 className='review-headline'>Thank you for your feedback</h1>
              <p className='review-supporting-text'>
                We really appreciate it.
              </p>
            </>
          )}

          {errorMessage && step !== 'error' && (
            <p className='review-supporting-text' style={{ color: '#dc2626' }}>
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewLanding