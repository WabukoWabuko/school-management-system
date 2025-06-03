import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">School Management System</h1>
        <p className="text-lg">Motto: Empowering Education, Building Futures</p>
      </header>
      <main className="p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Welcome to Our School</h2>
          <p className="mt-2">
            Founded in 2000, our school has been a beacon of quality education in Kenya.
            We strive to provide a nurturing environment for students, teachers, and parents.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Our History</h2>
          <p className="mt-2">
            Over the past two decades, we've grown from a small institution to a leading
            educational hub, serving hundreds of students with a dedicated staff.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <img src="https://via.placeholder.com/300" alt="School campus" className="rounded" />
            <img src="https://via.placeholder.com/300" alt="Students learning" className="rounded" />
            <img src="https://via.placeholder.com/300" alt="School event" className="rounded" />
          </div>
        </section>
        <section>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Login
          </a>
        </section>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 School Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
