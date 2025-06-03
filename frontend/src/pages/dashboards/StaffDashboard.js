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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Staff Dashboard</h2>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Manage Students</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Admission Number</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">{student.user}</td>
                <td className="border p-2">{student.admission_number}</td>
                <td className="border p-2">{student.class_instance}</td>
                <td className="border p-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Manage Fees</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Student</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Balance</th>
              <th className="border p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id}>
                <td className="border p-2">{fee.student}</td>
                <td className="border p-2">{fee.amount}</td>
                <td className="border p-2">{fee.balance}</td>
                <td className="border p-2">{fee.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffDashboard;
