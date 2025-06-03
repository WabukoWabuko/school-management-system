import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [timetable, setTimetable] = useState([]);
  const [homework, setHomework] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimetable();
    fetchHomework();
  }, []);

  const fetchTimetable = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/timetables/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimetable(response.data);
    } catch (err) {
      setError('Failed to fetch timetable');
    }
  };

  const fetchHomework = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/homework/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomework(response.data);
    } catch (err) {
      setError('Failed to fetch homework');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Timetable</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Day</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((entry) => (
              <tr key={entry.id}>
                <td className="border p-2">{entry.day}</td>
                <td className="border p-2">{entry.subject}</td>
                <td className="border p-2">{entry.start_time} - {entry.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Homework</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {homework.map((hw) => (
              <tr key={hw.id}>
                <td className="border p-2">{hw.subject}</td>
                <td className="border p-2">{hw.description}</td>
                <td className="border p-2">{hw.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentDashboard;
