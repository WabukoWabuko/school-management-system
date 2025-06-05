import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-3 fw-bold">Welcome to Elite Academy</h1>
          <p className="lead">Motto: Empowering Education, Building Futures</p>
          <Link to="/about" className="btn btn-light btn-lg mt-3">Learn More About Us</Link>
        </div>
      </div>
      <div className="container py-5">
        <div className="row">
          {[
            {
              title: "Academic Excellence",
              text: "Our rigorous curriculum and qualified staff ensure every student reaches their highest potential.",
              img: "https://via.placeholder.com/300x200?text=Academics",
            },
            {
              title: "Holistic Development",
              text: "We grow minds, hearts, and talents through leadership training, creative arts, and sports.",
              img: "https://via.placeholder.com/300x200?text=Development",
            },
            {
              title: "Global Perspective",
              text: "Exchange programs and international partnerships give our students the edge they need.",
              img: "https://via.placeholder.com/300x200?text=Global",
            },
          ].map((item, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div className="card h-100">
                <img src={item.img} className="card-img-top" alt={item.title} />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

