import React from 'react';

function CoCurricular() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Co-Curricular Activities</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img src="https://via.placeholder.com/300x200" className="card-img-top" alt="Sports" />
            <div className="card-body">
              <h5 className="card-title">Sports</h5>
              <p className="card-text">From football to athletics, our students excel in various sports.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img src="https://via.placeholder.com/300x200" className="card-img-top" alt="Music & Drama" />
            <div className="card-body">
              <h5 className="card-title">Music & Drama</h5>
              <p className="card-text">Our vibrant performances showcase creativity and talent.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img src="https://via.placeholder.com/300x200" className="card-img-top" alt="Clubs" />
            <div className="card-body">
              <h5 className="card-title">Clubs & Societies</h5>
              <p className="card-text">Debate, science, and environmental clubs foster leadership.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoCurricular;
