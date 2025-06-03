import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Elite Academy</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" exact activeClassName="active">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" activeClassName="active">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/co-curricular" activeClassName="active">Co-Curricular</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/gallery" activeClassName="active">Gallery</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" activeClassName="active">Contact</NavLink>
            </li>
            <li className="nav-item">
              {token ? (
                <button className="nav-link btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
              ) : (
                <NavLink className="nav-link btn btn-outline-light ms-2" to="/login">Login</NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
