import React from 'react'
import './HowItWorks.css';
import {BotMessageSquare,MessageCircleQuestionMark,CalendarCheck,PhoneForwarded,Handshake,Hammer,Dumbbell,MonitorCheck,UtensilsCrossed,Shield,TrendingUp} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

function HowItWorks() {
  return (
    <>
    <div className='howitworks-header'>
        <h1 className='HowItWorks_title'>How MordecAI Works</h1>
        <h2 className='HowItWorks_subtitle'>Peace of mind for your front desk — even during the busiest rush hours.</h2>
        <h2 className='section-subtitle'>What Happens When a Customer Calls:</h2>
    </div>

    <ScrollStack 
      useWindowScroll={true}
      itemDistance={80}
      stackPosition="15%"
      itemStackDistance={20}
    >
      <ScrollStackItem>
        <div className='step-card'>
          <div className='step-number'>1</div>
          <p>MordecAI answers immediately with a friendly greeting</p>
          <BotMessageSquare/>
        </div>
      </ScrollStackItem>
      <ScrollStackItem>
        <div className='step-card'>
          <div className='step-number'>2</div>
          <p>Handles reservations, questions, or pickup orders</p>
          <MessageCircleQuestionMark/>
        </div>
      </ScrollStackItem>
      <ScrollStackItem>
        <div className='step-card'>
          <div className='step-number'>3</div>
          <p>Sends confirmations automatically</p>
          <CalendarCheck/>
        </div>
      </ScrollStackItem>
      <ScrollStackItem>
        <div className='step-card'>
          <div className='step-number'>4</div>
          <p>Escalates to staff only when needed</p>
          <PhoneForwarded/>
        </div>
      </ScrollStackItem>
    </ScrollStack>

    <div className='trust-lines-container'>
      <div className='trust-lines-section'>
        <div className='trust-card'>
          <UtensilsCrossed size={48} color="#7B5FC6" strokeWidth={2}/>
          <h3>Designed for Real Restaurants</h3>
          <p>Built specifically for hospitality, not generic business automation</p>
        </div>
        <div className='trust-card'>
          <Shield size={48} color="#7B5FC6" strokeWidth={2}/>
          <h3>Personalized Control</h3>
          <p>We handle the tech — you stay in control.</p>
        </div>
        <div className='trust-card'>
          <TrendingUp size={48} color="#7B5FC6" strokeWidth={2}/>
          <h3>Grows with Your Business</h3>
          <p>Scales effortlessly from single location to enterprise operations</p>
        </div>
      </div>
    </div>
    
    <div className='howitworks-container'>
        <h2 className='process-title'>Our Implementation Process</h2>
        <div className='steps-container'>
          <ol>
            <li>
              <Handshake size={48} color="#7B5FC6"/>
              <h3>Discovery Call</h3>
              <p>We review your front desk workflow to find where automation will save you time and lost calls.</p>
            </li>
            <li>
              <Hammer size={48} color="#7B5FC6"/>
              <h3>Custom Solution Design</h3>
              <p>We build AI agents tailored to your restaurant's unique needs, voice, and workflow — handling reservations, 
                answering FAQs, and managing waitlists automatically.</p>
            </li>
            <li>
              <Dumbbell size={48} color="#7B5FC6"/>
              <h3>Implementation & Training</h3>
              <p>We deploy the system, connect it to your phone line and booking tools,
                 and train your team on how to monitor, override, and manage everything with confidence.</p>
            </li>
            <li>
              <MonitorCheck size={48} color="#7B5FC6"/>
              <h3>Ongoing Support & Optimization</h3>
              <p>We continuously monitor performance, refine responses based on real interactions, 
                and provide 24/7 support to ensure your AI stays sharp and effective.</p>
            </li>
          </ol>
        </div>
    </div>
    <hr className='howitworks_hr'/>
    </>
  )
}

export default HowItWorks 