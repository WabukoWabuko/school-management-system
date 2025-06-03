import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CoCurricular from './pages/CoCurricular';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import './index.css';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/co-curricular" element={<CoCurricular />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<div className="container py-5"><h2>Login Page (Coming Soon)</h2></div>} />
            <Route path="/dashboard" element={<div className="container py-5"><h2>Dashboard (Coming Soon)</h2></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
