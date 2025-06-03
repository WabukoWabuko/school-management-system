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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Teacher Dashboard</h2>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Enter Grade</h3>
        <form onSubmit={handleCreateGrade} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Student ID</label>
            <input
              type="text"
              name="student"
              value={formData.student}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Subject ID</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Marks</label>
            <input
              type="number"
              name="marks"
              value={formData.marks}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Grade
          </button>
        </form>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Manage Grades</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Student</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Marks</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td className="border p-2">{grade.student}</td>
                <td className="border p-2">{grade.subject}</td>
                <td className="border p-2">{grade.marks}</td>
                <td className="border p-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherDashboard;
