import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Modal, Button, Form } from 'react-bootstrap';

function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ student: '', subject: '', marks: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ type: '', data: {} });

  const fetchData = useCallback(async (endpoint, setter, errorMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !user?.id) throw new Error('Authentication required');
      const response = await axios.get(`http://localhost:8000/api/${endpoint}/?teacher_id=${user.id}`, {
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
      fetchData('grades', setGrades, 'Failed to fetch grades.');
    }
  }, [fetchData, user?.id]);

  const handleInputChange = (e) => {
    setModalData({
      ...modalData,
      data: { ...modalData.data, [e.target.name]: e.target.value },
    });
  };

  const handleCreateOrUpdate = async (data, endpoint, successMsg) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = modalData.type === 'create'
        ? `http://localhost:8000/api/${endpoint}/`
        : `http://localhost:8000/api/${endpoint}/${data.id}/`;
      const method = modalData.type === 'create' ? axios.post : axios.put;
      await method(url, data, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(endpoint, setGrades, `Failed to refresh ${endpoint}.`);
      toast.success(successMsg);
      setShowModal(false);
      setFormData({ student: '', subject: '', marks: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${modalData.type} grade.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, endpoint, successMsg) => {
    if (window.confirm(`Are you sure you want to delete this grade?`)) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/${endpoint}/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData(endpoint, setGrades, `Failed to refresh ${endpoint}.`);
        toast.success(successMsg);
      } catch (err) {
        toast.error(err.response?.data?.message || `Failed to delete grade ${id}.`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) return <div className="alert alert-danger m-3">Please log in to access the dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:h-50">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h2 className="text-3xl font-medium text-center text-gray-900 mb-6">Teacher Dashboard - Welcome, {user?.username || 'Teacher'}!</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {loading && <div className="text-center"><Spinner animation="border" /></div>}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Enter Grade</h3>
              <button
                onClick={() => {
                  setModalData({ type: 'create', data: { student: '', subject: '', marks: '' } });
                  setShowModal(true);
                }}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Grade
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Manage Grades</h3>
              {grades.length === 0 && !loading && <p className="text-gray-600">No grades to display.</p>}
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Student</th>
                    <th className="p-2">Subject</th>
                    <th className="p-2">Marks</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="border-b">
                      <td className="p-2">{grade.student}</td>
                      <td className="p-2">{grade.subject}</td>
                      <td className="p-2">{grade.marks}</td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            setModalData({ type: 'edit', data: grade });
                            setShowModal(true);
                          }}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(grade.id, 'grades', 'Grade deleted successfully.')}
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
          </div>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{modalData.type === 'create' ? 'Add' : 'Edit'} Grade</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleCreateOrUpdate(modalData.data, 'grades', `${modalData.type === 'create' ? 'Grade created' : 'Grade updated'} successfully.`);
              }}>
                <Form.Group className="mb-3">
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="student"
                    value={modalData.data.student || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Subject ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={modalData.data.subject || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Marks</Form.Label>
                  <Form.Control
                    type="number"
                    name="marks"
                    value={modalData.data.marks || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : modalData.type === 'create' ? 'Create' : 'Save'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
