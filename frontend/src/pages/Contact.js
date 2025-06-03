import React from 'react';

function Contact() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Contact Us</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <h3>Get in Touch</h3>
          <p><strong>Address:</strong> 123 Education Lane, Nairobi, Kenya</p>
          <p><strong>Phone:</strong> +254 700 123 456</p>
          <p><strong>Email:</strong> info@eliteacademy.co.ke</p>
        </div>
        <div className="col-md-6">
          <h3>Send a Message</h3>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea className="form-control" id="message" rows="4"></textarea>
          </div>
          <button type="button" className="btn btn-primary">Send</button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
