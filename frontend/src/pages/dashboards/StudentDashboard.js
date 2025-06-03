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
    <div className="container py-5">
      <h2 className="mb-4">Student Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Timetable</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Day</th>
                <th>Subject</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.day}</td>
                  <td>{entry.subject}</td>
                  <td>{entry.start_time} - {entry.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-4">Homework</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Description</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {homework.map((hw) => (
                <tr key={hw.id}>
                  <td>{hw.subject}</td>
                  <td>{hw.description}</td>
                  <td>{hw.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
