import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-3 fw-bold">Welcome to Elite Academy</h1>
          <p className="lead">Motto: Empowering Education, Building Futures</p>
          <Link to="/about" className="btn btn-light btn-lg mt-3">Learn More</Link>
        </div>
      </div>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <img src="https://via.placeholder.com/300x200" className="card-img-top" alt="Academic Excellence" />
              <div className="card-body">
                <h5 className="card-title">Academic Excellence</h5>
                <p className="card-text">Our rigorous curriculum prepares students for success in a competitive world.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <img src="https://via.placeholder.com/300x200" className="card-img-top" alt="Holistic Development" />
              <div className="card-body">
                <h5 className="card-title">Holistic Development</h5>
                <p className="card-text">We nurture students’ talents through sports, arts, and leadership programs.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <img src="https://via.placeholder.com/300x200" className="card-img-top" alt="Community Engagement" />
              <div className="card-body">
                <h5 className="card-title">Community Engagement</h5>
                <p className="card-text">Our students contribute to society through service and outreach initiatives.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
