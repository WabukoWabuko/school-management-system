import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-primary text-white p-4">
        <div className="container">
          <h1 className="display-4 fw-bold">School Management System</h1>
          <p className="lead">Motto: Empowering Education, Building Futures</p>
        </div>
      </header>
      <main className="container py-5">
        <section className="mb-5">
          <h2 className="h3 fw-semibold">Welcome to Our School</h2>
          <p className="mt-3">
            Founded in 2000, our school has been a beacon of quality education in Kenya.
            We strive to provide a nurturing environment for students, teachers, and parents.
          </p>
        </section>
        <section className="mb-5">
          <h2 className="h3 fw-semibold">Our History</h2>
          <p className="mt-3">
            Over the past two decades, we've grown from a small institution to a leading
            educational hub, serving hundreds of students with a dedicated staff.
          </p>
        </section>
        <section className="mb-5">
          <h2 className="h3 fw-semibold">Gallery</h2>
          <div className="row g-3">
            <div className="col-sm-6 col-md-4">
              <img src="https://via.placeholder.com/300" alt="School campus" className="img-fluid rounded" />
            </div>
            <div className="col-sm-6 col-md-4">
              <img src="https://via.placeholder.com/300" alt="Students learning" className="img-fluid rounded" />
            </div>
            <div className="col-sm-6 col-md-4">
              <img src="https://via.placeholder.com/300" alt="School event" className="img-fluid rounded" />
            </div>
          </div>
        </section>
        <section>
          <a href="/login" className="btn btn-primary btn-lg">
            Login
          </a>
        </section>
      </main>
      <footer className="bg-dark text-white text-center py-3">
        <p>© 2025 School Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
