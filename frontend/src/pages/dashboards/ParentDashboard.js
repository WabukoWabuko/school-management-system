import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';

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
    <div className="container py-5">
      <ToastContainer />
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="text-center mb-4">Parent Dashboard - Welcome, {user.username || 'Parent'}!</h2>
          {error && <div className="alert alert-danger text-center mb-4">{error}</div>}
          {loading && <div className="text-center"><Spinner animation="border" /></div>}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title mb-4">Fee Status</h3>
                  {fees.length === 0 && !loading && <p>No fees to display.</p>}
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Amount</th>
                        <th>Balance</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee) => (
                        <tr key={fee.id}>
                          <td>{fee.student}</td>
                          <td>{fee.amount}</td>
                          <td>{fee.balance}</td>
                          <td>{fee.due_date}</td>
                          <td>
                            <button
                              onClick={() => handlePayFee(fee.id)}
                              disabled={loading || fee.balance === 0}
                              className="btn btn-success btn-sm"
                            >
                              Pay
                            </button>
                          </td>
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
                  <h3 className="card-title mb-4">Child's Grades</h3>
                  {grades.length === 0 && !loading && <p>No grades to display.</p>}
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id}>
                          <td>{grade.subject}</td>
                          <td>{grade.marks}</td>
                          <td>{grade.remarks || 'N/A'}</td>
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

export default ParentDashboard;
