import React from 'react';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Services from './Pages/Services/Services';
import BookDemo from './Pages/BookDemo/BookDemo';
import SMSConsent from './Pages/SMSConsent/SMSConsent';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './Pages/TermsOfService/TermsOfService';
import './App.css';

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-demo" element={<BookDemo />} />
        <Route path="/services" element={<Services />} />
        <Route path="/sms-consent" element={<SMSConsent />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;