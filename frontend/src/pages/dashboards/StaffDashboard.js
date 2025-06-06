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
    <div className="container py-5">
      <ToastContainer />
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="text-center mb-4">Staff Dashboard - Welcome, {user.username || 'Staff'}!</h2>
          {error && <div className="alert alert-danger text-center mb-4">{error}</div>}
          {loading && <div className="text-center"><Spinner animation="border" /></div>}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title mb-4">Manage Students</h3>
                  {students.length === 0 && !loading && <p>No students to display.</p>}
                  <button
                    onClick={() => setShowModal({ type: 'create', data: { user: '', admission_number: '', class_instance: '' } })}
                    className="btn btn-primary mb-4"
                  >
                    Add Student
                  </button>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Admission Number</th>
                        <th>Class</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.user}</td>
                          <td>{student.admission_number}</td>
                          <td>{student.class_instance}</td>
                          <td>
                            <button
                              onClick={() => setShowModal({ type: 'edit', data: student })}
                              className="btn btn-warning btn-sm me-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student.id, 'students', 'Student deleted successfully.')}
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
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title mb-4">Manage Fees</h3>
                  {fees.length === 0 && !loading && <p>No fees to display.</p>}
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Amount</th>
                        <th>Balance</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee) => (
                        <tr key={fee.id}>
                          <td>{fee.student}</td>
                          <td>{fee.amount}</td>
                          <td>{fee.balance}</td>
                          <td>{fee.due_date}</td>
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
  );
}

export default StaffDashboard;
