import React from 'react';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import BookDemo from './Pages/BookDemo/BookDemo';
import './App.css';

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-demo" element={<BookDemo />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;