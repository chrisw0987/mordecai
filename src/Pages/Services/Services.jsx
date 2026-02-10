import React from 'react'
import './Services.css'
import { Link } from 'react-router-dom'

function Services() {
  const coreServices = [
    {
      id: 1,
      emoji: '📞',
      title: 'AI Receptionist',
      tagline: 'Never miss a customer call again',
      description: 'AI-powered receptionist that answers calls, books appointments, handles FAQs, captures leads, and follows up by text — 24/7.',
      benefits: [
        'Built for local businesses of all kinds.',
        'Available 24/7 without breaks or time off',
        'Consistent, professional service every time'
      ]
    },
    {
      id: 2,
      emoji: '📅',
      title: 'Booking & Lead Capture',
      tagline: 'Turn every call into a booked appointment',
      description: 'Automatically book appointments, collect caller info, and route high-intent leads to the right place.',
      benefits: [
        'Instant appointment scheduling',
        'Capture every lead opportunity',
        'Smart routing to the right team member',
        'Works with your existing calendar system'
      ]
    },
    {
      id: 3,
      emoji: '🔄',
      title: 'Missed Call Recovery',
      tagline: 'No lead left behind',
      description: 'Automatically follow up with callers who couldn\'t get through — so leads don\'t disappear.',
      benefits: [
        'Instant text follow-ups for missed calls',
        'Recover lost revenue opportunities',
        'Professional automated responses',
        'Keep customers engaged'
      ]
    },
    {
      id: 4,
      emoji: '💬',
      title: 'Customer Communication',
      tagline: 'Professional communication, zero manual work',
      description: 'Automated appointment confirmations, reminders, service updates, and after-hours responses.',
      benefits: [
        'Appointment confirmations and reminders',
        'Service update notifications',
        'After-hours professional responses',
        'No manual texting required'
      ]
    }
  ];

  const growthServices = [
    {
      id: 5,
      emoji: '🌐',
      title: 'SEO Websites',
      tagline: 'Get found online, convert more customers',
      description: 'Fast, mobile-friendly websites designed to rank locally and convert visitors into calls and bookings.',
      benefits: [
        'Optimized for local search rankings',
        'Mobile-responsive design',
        'Built-in call-to-action buttons',
        'Perfect for brick-and-mortar businesses'
      ]
    },
    {
      id: 6,
      emoji: '🎯',
      title: 'Local SEO Setup',
      tagline: 'Make sure customers can find you everywhere',
      description: 'Complete setup and optimization of your online presence across all platforms.',
      benefits: [
        'Google Business Profile optimization',
        'Consistent hours and info everywhere',
        'Enhanced call-to-action placement',
        'Directory listing management'
      ]
    },
    {
      id: 7,
      emoji: '🌍',
      title: 'Multilingual Support',
      tagline: 'Serve customers in their language',
      description: 'Serve customers in multiple languages without hiring more staff.',
      benefits: [
        'Support multiple languages instantly',
        'No additional staff needed',
        'Expand your customer base',
        'Perfect for diverse markets'
      ]
    },
    {
      id: 8,
      emoji: '📊',
      title: 'Insights & Analytics',
      tagline: 'See where your opportunities are',
      description: 'See when customers call, what they ask, and where opportunities are being missed.',
      benefits: [
        'Track call volume and patterns',
        'Identify common customer questions',
        'Spot missed opportunities',
        'Data-driven business decisions'
      ]
    }
  ];

  const comingSoonServices = [
    {
      id: 9,
      emoji: '🧠',
      title: 'AI Knowledge Base for Staff',
      tagline: 'Instant answers for your team',
      description: 'Internal AI assistant trained on your business policies, services, and procedures.',
      benefits: [
        'Trained on your specific business',
        'Perfect for clinics, offices, franchises',
        'Reduces training time for new staff',
        'Consistent information across teams'
      ]
    }
  ];

  return (
    <div className='services-wrapper'>
      <div className='services-container'>
        {/* Header */}
        <div className='services-header'>
          <h1>Our Services</h1>
          <p className='services-subtitle'>
            Comprehensive AI-powered solutions to transform your business operations
          </p>
        </div>

        {/* Core Services Section */}
        <div className='services-category'>
          <h2 className='category-title'>Core Services</h2>
          <div className='services-grid'>
            {coreServices.map((service) => (
              <div key={service.id} className='service-card'>
                <div className='service-card-front'>
                  <div className='service-emoji'>{service.emoji}</div>
                  <h3 className='service-title'>{service.title}</h3>
                  <p className='service-tagline'>{service.tagline}</p>
                </div>
                
                <div className='service-card-back'>
                  <div className='service-emoji-small'>{service.emoji}</div>
                  <h3 className='service-title-small'>{service.title}</h3>
                  <p className='service-description'>{service.description}</p>
                  <ul className='service-benefits'>
                    {service.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth & Optimization Section */}
        <div className='services-category'>
          <h2 className='category-title'>Growth & Optimization</h2>
          <div className='services-grid'>
            {growthServices.map((service) => (
              <div key={service.id} className='service-card'>
                <div className='service-card-front'>
                  <div className='service-emoji'>{service.emoji}</div>
                  <h3 className='service-title'>{service.title}</h3>
                  <p className='service-tagline'>{service.tagline}</p>
                </div>
                
                <div className='service-card-back'>
                  <div className='service-emoji-small'>{service.emoji}</div>
                  <h3 className='service-title-small'>{service.title}</h3>
                  <p className='service-description'>{service.description}</p>
                  <ul className='service-benefits'>
                    {service.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className='services-category coming-soon-section'>
          <h2 className='category-title'>Internal Tools <span className='coming-soon-badge'>Coming Soon</span></h2>
          <div className='services-grid coming-soon-grid'>
            {comingSoonServices.map((service) => (
              <div key={service.id} className='service-card coming-soon-card'>
                <div className='service-card-front'>
                  <div className='service-emoji'>{service.emoji}</div>
                  <h3 className='service-title'>{service.title}</h3>
                  <p className='service-tagline'>{service.tagline}</p>
                </div>
                
                <div className='service-card-back'>
                  <div className='service-emoji-small'>{service.emoji}</div>
                  <h3 className='service-title-small'>{service.title}</h3>
                  <p className='service-description'>{service.description}</p>
                  <ul className='service-benefits'>
                    {service.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='services-cta'>
          <h2>Ready to transform your business?</h2>
          <p>Book a free consultation to see how our services can work for you</p>
          <Link to="/book-demo">
            <button className='services-cta-button'>Book A Free Demo</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Services