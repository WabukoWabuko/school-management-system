import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Button } from 'react-bootstrap';

function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [timetable, setTimetable] = useState([]);
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (endpoint, setter, errorMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !user?.id) throw new Error('Authentication required');
      const response = await axios.get(`http://localhost:8000/api/${endpoint}/?student_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setter(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || errorMsg;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchData('timetables', setTimetable, 'Failed to fetch timetable.');
      fetchData('homework', setHomework, 'Failed to fetch homework.');
    }
  }, [fetchData, user?.id]);

  const handleCompleteHomework = async (hwId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8000/api/homework/${hwId}/`, { completed: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData('homework', setHomework, 'Failed to refresh homework.');
      toast.success('Homework marked as completed.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark homework as completed.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="alert alert-danger m-3">Please log in to access the dashboard.</div>;

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="text-center mb-4">Student Dashboard - Welcome, {user.username || 'Student'}!</h2>
          {error && <div className="alert alert-danger text-center mb-4">{error}</div>}
          {loading && <div className="text-center"><Spinner animation="border" /></div>}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title mb-4">Timetable</h3>
                  {timetable.length === 0 && !loading && <p>No timetable entries to display.</p>}
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
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title mb-4">Homework</h3>
                  {homework.length === 0 && !loading && <p>No homework to display.</p>}
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {homework.map((hw) => (
                        <tr key={hw.id}>
                          <td>{hw.subject}</td>
                          <td>{hw.description}</td>
                          <td>{hw.due_date}</td>
                          <td>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleCompleteHomework(hw.id)}
                              disabled={loading || hw.completed}
                              className="mr-2"
                            >
                              {hw.completed ? 'Completed' : 'Mark Done'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
