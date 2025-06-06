import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ParentDashboard() {
  const { user } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (endpoint, setter, errorMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !user?.id) throw new Error('Authentication required');
      const response = await axios.get(`http://localhost:8000/api/${endpoint}/?parent_id=${user.id}`, {
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
      fetchData('fees', setFees, 'Failed to fetch fees.');
      fetchData('grades', setGrades, 'Failed to fetch grades.');
    }
  }, [fetchData, user?.id]);

  const handlePayFee = async (feeId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/fees/${feeId}/pay/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData('fees', setFees, 'Failed to refresh fees.');
      toast.success('Fee payment processed successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process payment.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="alert alert-danger m-3">Please log in to access the dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Parent Dashboard - Welcome, {user.username || 'Parent'}!</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {loading && <div className="text-center"><Spinner animation="border" /></div>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Fee Status</h3>
              {fees.length === 0 && !loading && <p className="text-gray-600">No fees to display.</p>}
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Student</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Balance</th>
                    <th className="p-2">Due Date</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee) => (
                    <tr key={fee.id} className="border-b">
                      <td className="p-2">{fee.student}</td>
                      <td className="p-2">{fee.amount}</td>
                      <td className="p-2">{fee.balance}</td>
                      <td className="p-2">{fee.due_date}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handlePayFee(fee.id)}
                          disabled={loading || fee.balance === 0}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                          Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Child's Grades</h3>
              {grades.length === 0 && !loading && <p className="text-gray-600">No grades to display.</p>}
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Subject</th>
                    <th className="p-2">Marks</th>
                    <th className="p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="border-b">
                      <td className="p-2">{grade.subject}</td>
                      <td className="p-2">{grade.marks}</td>
                      <td className="p-2">{grade.remarks || 'N/A'}</td>
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

export default ParentDashboard;
