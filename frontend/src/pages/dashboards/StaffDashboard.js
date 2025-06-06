import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Modal, Button, Form } from 'react-bootstrap';

function StaffDashboard() {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ type: '', data: {} });

  const fetchData = useCallback(async (endpoint, setter, errorMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !user?.id) throw new Error('Authentication required');
      const response = await axios.get(`http://localhost:8000/api/${endpoint}/?staff_id=${user.id}`, {
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
      fetchData('students', setStudents, 'Failed to fetch students.');
      fetchData('fees', setFees, 'Failed to fetch fees.');
    }
  }, [fetchData, user?.id]);

  const handleCreateOrUpdate = async (data, endpoint, successMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = modalData.type === 'create'
        ? `http://localhost:8000/api/${endpoint}/`
        : `http://localhost:8000/api/${endpoint}/${data.id}/`;
      const method = modalData.type === 'create' ? axios.post : axios.put;
      await method(url, data, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(endpoint, endpoint === 'students' ? setStudents : setFees, 'Failed to refresh data.');
      toast.success(successMsg);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${modalData.type} data.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, endpoint, successMsg) => {
    if (window.confirm(`Are you sure you want to delete this ${endpoint.slice(0, -1)}?`)) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/${endpoint}/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData(endpoint, endpoint === 'students' ? setStudents : setFees, 'Failed to refresh data.');
        toast.success(successMsg);
      } catch (err) {
        toast.error(err.response?.data?.message || `Failed to delete ${endpoint}.`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) return <div className="alert alert-danger m-3">Please log in to access the dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Staff Dashboard - Welcome, {user.username || 'Staff'}!</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {loading && <div className="text-center"><Spinner animation="border" /></div>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Manage Students</h3>
              {students.length === 0 && !loading && <p className="text-gray-600">No students to display.</p>}
              <button
                onClick={() => setShowModal({ type: 'create', data: { user: '', admission_number: '', class_instance: '' } })}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Student
              </button>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Name</th>
                    <th className="p-2">Admission Number</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="p-2">{student.user}</td>
                      <td className="p-2">{student.admission_number}</td>
                      <td className="p-2">{student.class_instance}</td>
                      <td className="p-2">
                        <button
                          onClick={() => setShowModal({ type: 'edit', data: student })}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, 'students', 'Student deleted successfully.')}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Manage Fees</h3>
              {fees.length === 0 && !loading && <p className="text-gray-600">No fees to display.</p>}
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Student</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Balance</th>
                    <th className="p-2">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee) => (
                    <tr key={fee.id} className="border-b">
                      <td className="p-2">{fee.student}</td>
                      <td className="p-2">{fee.amount}</td>
                      <td className="p-2">{fee.balance}</td>
                      <td className="p-2">{fee.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{showModal?.type === 'create' ? 'Add' : 'Edit'} Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleCreateOrUpdate(modalData.data, 'students', `${showModal.type === 'create' ? 'Student created' : 'Student updated'} successfully.`);
              }}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.data.user || ''}
                    onChange={(e) => setModalData({ ...modalData, data: { ...modalData.data, user: e.target.value } })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Admission Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.data.admission_number || ''}
                    onChange={(e) => setModalData({ ...modalData, data: { ...modalData.data, admission_number: e.target.value } })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.data.class_instance || ''}
                    onChange={(e) => setModalData({ ...modalData, data: { ...modalData.data, class_instance: e.target.value } })}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : showModal.type === 'create' ? 'Create' : 'Save'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
