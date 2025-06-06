import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await axios.post('http://localhost:8000/api/contact/', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h2 className="text-center mb-4">Contact Us</h2>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="card-title mb-3">Get in Touch</h3>
                      <p><strong>Address:</strong> 123 Education Lane, Nairobi, Kenya</p>
                      <p><strong>Phone:</strong> <a href="tel:+254700123456" className="text-primary">+254 700 123 456</a> / <a href="tel:+254722456789" className="text-primary">+254 722 456 789</a></p>
                      <p><strong>Email:</strong> <a href="mailto:info@eliteacademy.co.ke" className="text-primary">info@eliteacademy.co.ke</a></p>
                      <p><strong>Office Hours:</strong> Mon - Fri: 8:00 AM - 5:00 PM</p>
                      <div className="mt-3">
                        <p className="font-weight-bold">Follow Us:</p>
                        <div className="d-flex mt-2">
                          <a href="https://facebook.com/EliteAcademyKenya" target="_blank" rel="noopener noreferrer" className="text-primary me-3">
                            <span className="sr-only">Facebook</span>
                            <i className="fab fa-facebook-f"></i>
                          </a>
                          <a href="https://instagram.com/eliteacademy.ke" target="_blank" rel="noopener noreferrer" className="text-primary me-3">
                            <span className="sr-only">Instagram</span>
                            <i className="fab fa-instagram"></i>
                          </a>
                          <a href="https://twitter.com/EliteAcademyKe" target="_blank" rel="noopener noreferrer" className="text-primary">
                            <span className="sr-only">Twitter</span>
                            <i className="fab fa-twitter"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="card-title mb-3">Our Location</h3>
                      <iframe
                        title="Elite Academy Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.84773542466!2d36.82194661452028!3d-1.2920659999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17ec9c1a5a6d%3A0x8f8b4c8e2e2e2e2e!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1623456789!5m2!1sen!2ske"
                        width="100%"
                        height="250"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        aria-hidden="false"
                        className="rounded"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title mb-4">Send a Message</h3>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="form-control"
                        required
                        aria-required="true"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-100"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
