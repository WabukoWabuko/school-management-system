import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CoCurricular from './pages/CoCurricular';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import StaffDashboard from './pages/dashboards/StaffDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/co-curricular" element={<CoCurricular />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />
                }
              />
              <Route
                path="/dashboard/teacher"
                element={
                  <ProtectedRoute component={TeacherDashboard} allowedRoles={['teacher']} />
                }
              />
              <Route
                path="/dashboard/parent"
                element={
                  <ProtectedRoute component={ParentDashboard} allowedRoles={['parent']} />
                }
              />
              <Route
                path="/dashboard/student"
                element={
                  <ProtectedRoute component={StudentDashboard} allowedRoles={['student']} />
                }
              />
              <Route
                path="/dashboard/staff"
                element={
                  <ProtectedRoute component={StaffDashboard} allowedRoles={['staff']} />
                }
              />
              <Route path="/dashboard" element={<div className="container py-5"><h2>Select a Role Dashboard</h2></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
