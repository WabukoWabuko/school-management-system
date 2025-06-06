import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="text-2xl font-bold text-white">
            Elite Academy
          </NavLink>
          <button
            className="md:hidden text-white focus:outline-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation menu"
          >
            <span className="text-2xl">☰</span>
          </button>
          <div className="hidden md:flex space-x-6 items-center" id="navbarNav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `text-white hover:text-gray-200 transition ${isActive ? 'font-bold border-b-2 border-white' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `text-white hover:text-gray-200 transition ${isActive ? 'font-bold border-b-2 border-white' : ''}`}
            >
              About
            </NavLink>
            <NavLink
              to="/co-curricular"
              className={({ isActive }) => `text-white hover:text-gray-200 transition ${isActive ? 'font-bold border-b-2 border-white' : ''}`}
            >
              Co-Curricular
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) => `text-white hover:text-gray-200 transition ${isActive ? 'font-bold border-b-2 border-white' : ''}`}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `text-white hover:text-gray-200 transition ${isActive ? 'font-bold border-b-2 border-white' : ''}`}
            >
              Contact
            </NavLink>
            {user && (
              <NavLink
                to={`/${user.role.toLowerCase()}-dashboard`}
                className={({ isActive }) => `text-white hover:text-gray-200 transition ${isActive ? 'font-bold border-b-2 border-white' : ''}`}
              >
                Dashboard
              </NavLink>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) => `bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ${isActive ? 'font-bold' : ''}`}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
