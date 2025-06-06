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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Get in Touch</h3>
                  <p className="text-gray-600"><strong>Address:</strong> 123 Education Lane, Nairobi, Kenya</p>
                  <p className="text-gray-600"><strong>Phone:</strong> <a href="tel:+254700123456" className="text-blue-500 hover:underline">+254 700 123 456</a> / <a href="tel:+254722456789" className="text-blue-500 hover:underline">+254 722 456 789</a></p>
                  <p className="text-gray-600"><strong>Email:</strong> <a href="mailto:info@eliteacademy.co.ke" className="text-blue-500 hover:underline">info@eliteacademy.co.ke</a></p>
                  <p className="text-gray-600"><strong>Office Hours:</strong> Mon - Fri: 8:00 AM - 5:00 PM</p>
                  <div className="mt-4">
                    <p className="text-gray-600 font-semibold">Follow Us:</p>
                    <div className="flex space-x-4 mt-2">
                      <a href="https://facebook.com/EliteAcademyKenya" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <span className="sr-only">Facebook</span>
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="https://instagram.com/eliteacademy.ke" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                        <span className="sr-only">Instagram</span>
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="https://twitter.com/EliteAcademyKe" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                        <span className="sr-only">Twitter</span>
                        <i className="fab fa-twitter"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow h-64">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Our Location</h3>
                  <iframe
                    title="Elite Academy Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.84773542466!2d36.82194661452028!3d-1.2920659999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17ec9c1a5a6d%3A0x8f8b4c8e2e2e2e2e!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1623456789!5m2!1sen!2ske"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    aria-hidden="false"
                    className="rounded"
                  ></iframe>
                </div>
              </div>
              <div>
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Send a Message</h3>
                  {error && <div className="text-red-500 mb-4">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        aria-required="true"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition duration-300 disabled:bg-gray-400"
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
