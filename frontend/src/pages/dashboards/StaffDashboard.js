import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StaffDashboard() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/students/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
      } catch (err) {
        setError('Failed to fetch students');
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Staff Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title">Manage Students</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Admission Number</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.user}</td>
                  <td>{student.admission_number}</td>
                  <td>{student.class_instance}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2">Edit</button>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
