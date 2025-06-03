import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StaffDashboard() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

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

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/fees/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFees(response.data);
    } catch (err) {
      setError('Failed to fetch fees');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Staff Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Manage Students</h3>
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
                    <button className="btn btn-warning btn-sm me-2">Edit</button>
                    <button className="btn btn-primary btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-4">Manage Fees</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td>{fee.student}</td>
                  <td>{fee.amount}</td>
                  <td>{fee.balance}</td>
                  <td>{fee.due_date}</td>
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
