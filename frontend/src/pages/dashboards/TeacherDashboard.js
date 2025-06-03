import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TeacherDashboard() {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    student: '',
    subject: '',
    marks: '',
  });

  useEffect(() => {
    fetchGrades();
  }, []);

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateGrade = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/grades/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGrades();
      setFormData({ student: '', subject: '', marks: '' });
    } catch (err) {
      setError('Failed to create grade');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Teacher Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Enter Grade</h3>
          <form onSubmit={handleCreateGrade}>
            <div className="mb-3">
              <label htmlFor="student" className="form-label">Student ID</label>
              <input
                type="text"
                className="form-control"
                id="student"
                name="student"
                value={formData.student}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">Subject ID</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="marks" className="form-label">Marks</label>
              <input
                type="number"
                className="form-control"
                id="marks"
                name="marks"
                value={formData.marks}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Grade</button>
          </form>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-4">Manage Grades</h3>
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
                    <button className="btn btn-warning btn-sm me-2">Edit</button>
                    <button className="btn btn-primary btn-sm">Delete</button>
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
