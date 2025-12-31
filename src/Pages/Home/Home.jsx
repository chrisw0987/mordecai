import React from 'react';
import Hero from '../../Components/Hero/Hero';
import ProblemtoOutcome from '../../Components/ProblemtoOutcome/ProblemtoOutcome';
import WhatWeAutomate from '../../Components/WhatWeAutomate/WhatWeAutomate';
import HowItWorks from '../../Components/HowItWorks/HowItWorks';
import UseCases from '../../Components/UseCases/UseCases';
import WhoThisIsFor from '../../Components/WhoThisIsFor/WhoThisIsFor';
import BuiltforOperations from '../../Components/BuiltforOperations/BuiltforOperations';
import './Home.css';

function Home() {
  return (
    <div>
      <div id="home">
        <Hero/>
      </div>
      
      <div id="about">
        <ProblemtoOutcome/>
        <HowItWorks/>
      </div>
      
      <div id="learn-more">
        <WhatWeAutomate/>
        <UseCases/>
      </div>
      
      <div id="contact">
        <WhoThisIsFor/>
        <BuiltforOperations/>
      </div>
    </div>
  )
}

export default Home