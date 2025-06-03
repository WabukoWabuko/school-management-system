import React from 'react';

function About() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">About Elite Academy</h2>
      <div className="row">
        <div className="col-md-6">
          <h3>Our History</h3>
          <p>
            Founded in 2000, Elite Academy has grown into a leading educational institution in Kenya,
            serving over 1,000 students with a dedicated team of educators.
          </p>
          <h3>Our Mission</h3>
          <p>
            To provide quality education that empowers students to achieve their full potential and
            contribute positively to society.
          </p>
          <h3>Our Vision</h3>
          <p>
            To be a global leader in holistic education, fostering innovation and excellence.
          </p>
        </div>
        <div className="col-md-6">
          <img src="https://via.placeholder.com/500x300" className="img-fluid rounded" alt="School Campus" />
        </div>
      </div>
    </div>
  );
}

export default About;
