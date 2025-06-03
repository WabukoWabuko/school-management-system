import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ParentDashboard() {
  const [fees, setFees] = useState([]);
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFees();
    fetchGrades();
  }, []);

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

  return (
    <div className="container py-5">
      <h2 className="mb-4">Parent Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Fee Status</h3>
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
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-4">Child's Grades</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.subject}</td>
                  <td>{grade.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
