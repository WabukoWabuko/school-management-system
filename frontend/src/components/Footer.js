import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold mb-2">Elite Academy</h3>
            <p className="text-gray-400">Empowering Education, Building Futures</p>
            <p className="text-gray-400 mt-1">© {currentYear} Elite Academy. All rights reserved.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-cyan-400 transition">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition">Contact</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-cyan-400 transition">Gallery</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://facebook.com/EliteAcademyKenya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition">
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com/eliteacademy.ke" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition">
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com/EliteAcademyKe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
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
