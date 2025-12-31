import React from 'react'
import './ProblemtoOutcome.css';
import { PhoneMissed, CalendarClock, Repeat} from 'lucide-react';

function ProblemtoOutcome() {
  return (
    <>
    <div className='problem-container'>
        <h1 className='ProblemtoOutcome_title'>Where Do Most Businesses Lose Time and Money?</h1>

        <div className='cards-container'>
            <div className='card1'>
                <PhoneMissed size={48} color="#f90000ff" />
                <h2>Missed Calls & Slow Responses</h2>
            </div> 

            <div className='card2'>
                <CalendarClock size={48} color="#f1ed0fff"/>
                <h2>Manual Follow Ups & Scheduling</h2>
            </div>

            <div className='card3'>
                <Repeat size={48} color="#00c3ffff"/>
                <h2>Repetitive Admin Work</h2>
            </div>
        </div>
    </div>
    <hr className='ProblemtoOutcome_hr'/>
    </>
  )
}

export default ProblemtoOutcome