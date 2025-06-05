import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  console.log('AdminDashboard: Rendered, user:', user); // Log on every render
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'student',
    password: '',
  });

  useEffect(() => {
    console.log('AdminDashboard: useEffect triggered');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch users. Please try again.');
      console.error('Fetch users error:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/users/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setFormData({ username: '', email: '', role: 'student', password: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user. Please check the form data.');
      console.error('Create user error:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError('');
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete user. Please try again.');
        console.error('Delete user error:', err);
      }
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Welcome, {user?.username || 'Admin'}!</h3>
          <p>Manage users, classes, and settings from this dashboard.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Create User</h3>
          <form onSubmit={handleCreateUser}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                className="form-select"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create User</button>
          </form>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-4">Manage Users</h3>
          {users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        disabled
                        title="Edit functionality coming soon"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
