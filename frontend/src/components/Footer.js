import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 text-center text-md-left mb-3 mb-md-0">
            <h3 className="h5 mb-2">Elite Academy</h3>
            <p>Empowering Education, Building Futures</p>
            <p>© {currentYear} Elite Academy. All rights reserved.</p>
          </div>
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <h3 className="h5 mb-2">Quick Links</h3>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-white">About</Link></li>
              <li><Link to="/contact" className="text-white">Contact</Link></li>
              <li><Link to="/gallery" className="text-white">Gallery</Link></li>
            </ul>
          </div>
          <div className="col-md-4 text-center text-md-right">
            <h3 className="h5 mb-2">Follow Us</h3>
            <div className="d-flex justify-content-center justify-content-md-end">
              <a href="https://facebook.com/EliteAcademyKenya" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com/eliteacademy.ke" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com/EliteAcademyKe" target="_blank" rel="noopener noreferrer" className="text-white">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
