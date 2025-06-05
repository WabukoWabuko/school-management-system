import React from 'react';

function About() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">About Elite Academy</h2>
      <div className="row">
        <div className="col-md-6">
          <h3>Our History</h3>
          <p>
            Established in the year 2000, Elite Academy has evolved from a humble institution into one of Kenya’s most respected centers for academic excellence.
            With over two decades of consistent performance, the Academy has graduated thousands of students who are now making waves in various sectors globally.
          </p>
          <h3>Our Mission</h3>
          <p>
            To nurture well-rounded individuals through a blend of academic rigor, character development, and hands-on learning that inspires innovation and excellence.
          </p>
          <h3>Our Vision</h3>
          <p>
            To become Africa’s premier institution for transformative education, shaping future leaders who think globally and act locally.
          </p>
          <h3>Core Values</h3>
          <ul>
            <li>Integrity & Accountability</li>
            <li>Innovation & Curiosity</li>
            <li>Inclusivity & Respect</li>
            <li>Leadership & Service</li>
          </ul>
          <h3>Awards & Recognition</h3>
          <p>
            Recognized by the Ministry of Education as a top-tier school for over 10 consecutive years, and awarded the Best Performing Institution in Nairobi County in 2023.
          </p>
        </div>
        <div className="col-md-6">
          <img src="https://via.placeholder.com/500x300" className="img-fluid rounded mb-4" alt="School Campus" />
          <img src="https://via.placeholder.com/500x300" className="img-fluid rounded" alt="School Assembly" />
        </div>
      </div>
    </div>
  );
}

export default About;

