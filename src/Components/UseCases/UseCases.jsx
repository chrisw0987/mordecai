import React from 'react';
import './UseCases.css';
import { Phone, Calendar, ShoppingBag, Moon, X, Check } from 'lucide-react';

function UseCases() {
  return (
    <>
      <div className='use-cases-container'>
        <h1 className='use-cases-title'>Real-World Impact</h1>
        <p className='use-cases-subtitle'>
          See how MordecAI transforms everyday challenges into seamless operations.
        </p>

        <div className='use-cases-grid'>
          <div className='use-case-card'>
            <div className='use-case-header'>
              <div className='use-case-icon'>
                <Phone size={32} strokeWidth={2} />
              </div>
              <h3>Dinner Rush, Phones Ringing Nonstop</h3>
            </div>
            
            <div className='comparison-container'>
              <div className='without-section'>
                <div className='comparison-label without'>
                  <X size={18} />
                  <span>Without MordecAI</span>
                </div>
                <p>Staff ignores calls or puts customers on hold while serving tables.</p>
              </div>
              
              <div className='with-section'>
                <div className='comparison-label with'>
                  <Check size={18} />
                  <span>With MordecAI</span>
                </div>
                <p>Every call is answered, reservations are booked, and staff stays focused on guests.</p>
              </div>
            </div>
          </div>

          <div className='use-case-card'>
            <div className='use-case-header'>
              <div className='use-case-icon'>
                <Calendar size={32} strokeWidth={2} />
              </div>
              <h3>Missed Calls = Lost Tables</h3>
            </div>
            
            <div className='comparison-container'>
              <div className='without-section'>
                <div className='comparison-label without'>
                  <X size={18} />
                  <span>Without MordecAI</span>
                </div>
                <p>Customers call, don't get an answer, and book somewhere else.</p>
              </div>
              
              <div className='with-section'>
                <div className='comparison-label with'>
                  <Check size={18} />
                  <span>With MordecAI</span>
                </div>
                <p>Calls are answered instantly and reservations are captured automatically.</p>
              </div>
            </div>
          </div>

          <div className='use-case-card'>
            <div className='use-case-header'>
              <div className='use-case-icon'>
                <ShoppingBag size={32} strokeWidth={2} />
              </div>
              <h3>Pickup Orders Without Disruptions</h3>
            </div>
            
            <div className='comparison-container'>
              <div className='without-section'>
                <div className='comparison-label without'>
                  <X size={18} />
                  <span>Without MordecAI</span>
                </div>
                <p>Staff stops what they're doing to take orders over the phone.</p>
              </div>
              
              <div className='with-section'>
                <div className='comparison-label with'>
                  <Check size={18} />
                  <span>With MordecAI</span>
                </div>
                <p>Orders are taken accurately without pulling staff away from service.</p>
              </div>
            </div>
          </div>

          <div className='use-case-card'>
            <div className='use-case-header'>
              <div className='use-case-icon'>
                <Moon size={32} strokeWidth={2} />
              </div>
              <h3>After-Hours Calls Still Get Handled</h3>
            </div>
            
            <div className='comparison-container'>
              <div className='without-section'>
                <div className='comparison-label without'>
                  <X size={18} />
                  <span>Without MordecAI</span>
                </div>
                <p>Calls go to voicemail — or nowhere.</p>
              </div>
              
              <div className='with-section'>
                <div className='comparison-label with'>
                  <Check size={18} />
                  <span>With MordecAI</span>
                </div>
                <p>Customers can still get info or leave a message for the next day.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className='Usecase_hr'/>
    </>
  );
}

export default UseCases;