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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Student Dashboard - Welcome, {user.username || 'Student'}!</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {loading && <div className="text-center"><Spinner animation="border" /></div>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Timetable</h3>
              {timetable.length === 0 && !loading && <p className="text-gray-600">No timetable entries to display.</p>}
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Day</th>
                    <th className="p-2">Subject</th>
                    <th className="p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-2">{entry.day}</td>
                      <td className="p-2">{entry.subject}</td>
                      <td className="p-2">{entry.start_time} - {entry.end_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Homework</h3>
              {homework.length === 0 && !loading && <p className="text-gray-600">No homework to display.</p>}
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Subject</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Due Date</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homework.map((hw) => (
                    <tr key={hw.id} className="border-b">
                      <td className="p-2">{hw.subject}</td>
                      <td className="p-2">{hw.description}</td>
                      <td className="p-2">{hw.due_date}</td>
                      <td className="p-2">
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
  );
}

export default StudentDashboard;
