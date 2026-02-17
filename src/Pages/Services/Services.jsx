import React from 'react'
import './Services.css'
import { Link } from 'react-router-dom'
import ServiceCard from '../../Components/ServiceCard/ServiceCard'

function Services() {
  return (
    <div className='services-wrapper'>
      <div className='services-container'>
        {/* Header */}
        <div className='services-header'>
          <h1>Our Services</h1>
          <p className='services-subtitle'>
            Automation systems designed to capture more customers and increase revenue
          </p>
        </div>

        {/* Core Services Section */}
        <div className='services-category'>
          <h2 className='category-title'>Core Services</h2>
          <div className='services-grid'>
            <ServiceCard
              emoji="📞"
              title="AI Receptionist"
              tagline="Never miss a customer call again"
              description="AI-powered receptionist that answers calls, books appointments, handles FAQs, captures leads, and follows up by text — 24/7."
              benefits={[
                'Built for local businesses of all kinds',
                'Available 24/7 without breaks or time off',
                'Consistent, professional service every time'
              ]}
            />
            
            <ServiceCard
              emoji="📅"
              title="Booking & Lead Capture"
              tagline="Turn every call into a booked appointment"
              description="Automatically book appointments, collect caller info, and route high-intent leads to the right place."
              benefits={[
                'Instant appointment scheduling',
                'Capture every lead opportunity',
                'Smart routing to the right team member'
              ]}
            />
            
            <ServiceCard
              emoji="🔄"
              title="Missed Call Recovery"
              tagline="No lead left behind"
              description="Automatically follow up with callers who couldn't get through — so leads don't disappear."
              benefits={[
                'Instant text follow-ups for missed calls',
                'Recover lost revenue opportunities',
                'Keep customers engaged'
              ]}
            />
            
            <ServiceCard
              emoji="💬"
              title="24/7 Website Live Chat"
              tagline="Capture leads even after hours"
              description="AI-powered agent that answers, captures leads, and books appointments automatically — even when you're closed."
              benefits={[
                'Instant answers to common customer questions',
                'Capture name, phone, and service interest',
                'Book appointments or request callbacks automatically'
              ]}
            />
          </div>
        </div>

        {/* Growth & Optimization Section */}
        <div className='services-category'>
          <h2 className='category-title'>Growth & Optimization</h2>
          <div className='services-grid'>
            <ServiceCard
              emoji="🌐"
              title="Optimized Websites"
              tagline="Get found online, convert more customers"
              description="Fast, mobile-friendly websites designed to rank locally and convert visitors into calls and bookings."
              benefits={[
                'Optimized for local search rankings',
                'Mobile-responsive design',
                'Built-in call-to-action buttons'
              ]}
            />
            
            <ServiceCard
              emoji="🎯"
              title="Google & Local SEO Setup"
              tagline="Make sure customers can find you everywhere"
              description="Complete setup and optimization of your online presence across all platforms."
              benefits={[
                'Google Business Profile optimization',
                'Consistent hours and info everywhere',
                'Directory listing management'
              ]}
            />
            
            <ServiceCard
              emoji="🌍"
              title="Multilingual Support"
              tagline="Serve customers in their language"
              description="Serve customers in multiple languages without hiring more staff."
              benefits={[
                'Support multiple languages instantly',
                'No additional staff needed',
                'Perfect for diverse markets'
              ]}
            />
            
            <ServiceCard
              emoji="⭐"
              title="Review & Reputation Automation"
              tagline="Turn happy customers into 5-star reviews"
              description="Automatically request reviews from satisfied customers and strengthen your online reputation without chasing feedback manually."
              benefits={[
                'Automated post-service review requests',
                'Boost Google and Yelp ratings',
                'Build trust with future customers'
              ]}
            />
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className='services-category coming-soon-section'>
          <h2 className='category-title'>
            Internal Efficiency <span className='coming-soon-badge'>Coming Soon</span>
          </h2>
          <div className='services-grid coming-soon-grid'>
            <ServiceCard
              emoji="🧠"
              title="AI Knowledge Base for Staff"
              tagline="Instant answers for your team"
              description="Internal AI assistant trained on your business policies, services, and procedures."
              benefits={[
                'Trained on your specific business',
                'Perfect for clinics, offices, franchises',
                'Reduces training time for new staff'
              ]}
              isComingSoon={true}
            />

            <ServiceCard
              emoji="📊"
              title="Call Analytics Dashboard"
              tagline="See where your opportunities are"
              description="See when customers call, what they ask, and where opportunities are being missed."
              benefits={[
                'Track call volume and patterns',
                'Identify common customer questions',
                'Data-driven business decisions'
              ]}
              
            />
            
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