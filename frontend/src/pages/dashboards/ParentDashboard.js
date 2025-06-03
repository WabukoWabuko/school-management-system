import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ParentDashboard() {
  const [fees, setFees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchFees();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Parent Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title">Fee Status</h3>
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

export default ParentDashboard;
