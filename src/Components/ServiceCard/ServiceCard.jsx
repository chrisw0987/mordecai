import React from 'react'
import './ServiceCard.css'

function ServiceCard({ emoji, title, tagline, description, benefits, isComingSoon }) {
  return (
    <div className={`service-card ${isComingSoon ? 'coming-soon-card' : ''}`}>
      <div className='service-card-front'>
        <div className='service-emoji'>{emoji}</div>
        <h3 className='service-title'>{title}</h3>
        <p className='service-tagline'>{tagline}</p>
      </div>
      
      <div className='service-card-back'>
        <div className='service-emoji-small'>{emoji}</div>
        <h3 className='service-title-small'>{title}</h3>
        <p className='service-description'>{description}</p>
        <ul className='service-benefits'>
          {benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ServiceCard