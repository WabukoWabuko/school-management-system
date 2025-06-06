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
    <div className="container py-5">
      <ToastContainer />
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="text-center mb-4">Teacher Dashboard - Welcome, {user?.username || 'Teacher'}!</h2>
          {error && <div className="alert alert-danger text-center mb-4">{error}</div>}
          {loading && <div className="text-center"><Spinner animation="border" /></div>}
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title mb-4">Enter Grade</h3>
                  <button
                    onClick={() => {
                      setModalData({ type: 'create', data: { student: '', subject: '', marks: '' } });
                      setShowModal(true);
                    }}
                    className="btn btn-primary mb-4"
                  >
                    Add Grade
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title mb-4">Manage Grades</h3>
                  {grades.length === 0 && !loading && <p>No grades to display.</p>}
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id}>
                          <td>{grade.student}</td>
                          <td>{grade.subject}</td>
                          <td>{grade.marks}</td>
                          <td>
                            <button
                              onClick={() => {
                                setModalData({ type: 'edit', data: grade });
                                setShowModal(true);
                              }}
                              className="btn btn-warning btn-sm me-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(grade.id, 'grades', 'Grade deleted successfully.')}
                              className="btn btn-danger btn-sm"
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
