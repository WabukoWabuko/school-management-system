import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TeacherDashboard() {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/grades/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGrades(response.data);
      } catch (err) {
        setError('Failed to fetch grades');
      }
    };
    fetchGrades();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Teacher Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title">Manage Grades</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.student}</td>
                  <td>{grade.subject}</td>
                  <td>{grade.marks}</td>
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

export default TeacherDashboard;
