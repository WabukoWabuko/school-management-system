import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', formData);
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);

      // Fetch user data to get role
      const userResponse = await axios.get('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      const user = userResponse.data;
      setUser(user);

      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'teacher':
          navigate('/dashboard/teacher');
          break;
        case 'parent':
          navigate('/dashboard/parent');
          break;
        case 'student':
          navigate('/dashboard/student');
          break;
        case 'staff':
          navigate('/dashboard/staff');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
