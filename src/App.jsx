import React from 'react';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Services from './Pages/Services/Services';
import BookDemo from './Pages/BookDemo/BookDemo';
import SMSConsent from './Pages/SMSConsent/SMSConsent';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './Pages/TermsOfService/TermsOfService';
import ReviewLanding from './Pages/ReviewLanding/ReviewLanding';
import './App.css';

function App() {
  const location = useLocation()
  const isReviewPage = location.pathname.startsWith('/review')

  return (
    <>
      <ScrollToTop />

      {/* Hide Navbar on review page */}
      {!isReviewPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-demo" element={<BookDemo />} />
        <Route path="/services" element={<Services />} />
        <Route path="/sms-consent" element={<SMSConsent />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Review route */}
        <Route path="/review/:token" element={<ReviewLanding />} />
      </Routes>

      {/* Hide Footer on review page */}
      {!isReviewPage && <Footer />}
    </>
  );
}

export default App;