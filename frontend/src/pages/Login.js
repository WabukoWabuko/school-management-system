import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data } = await axios.post('http://localhost:8000/api/token/', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { access, refresh } = data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);

      const userRes = await axios.get('http://localhost:8000/api/users/me/', {
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
      });

      const user = userRes.data;
      setUser(user);
      console.log('Login successful:', user);

      const effectiveRole = user.is_superuser ? 'admin' : user.role;

      const routeMap = {
        admin: '/dashboard/admin',
        teacher: '/dashboard/teacher',
        parent: '/dashboard/parent',
        student: '/dashboard/student',
        staff: '/dashboard/staff',
      };

      const redirectPath = routeMap[effectiveRole] || '/';
      console.log(`Redirecting to ${redirectPath}`);
      navigate(redirectPath);

    } catch (err) {
      console.error('Login error:', err.response || err.message);
      if (err.response?.status === 401) {
        setError('Invalid username or password.');
      } else if (err.response?.status === 404) {
        setError('User profile not found. Is your backend running?');
      } else {
        setError('Unexpected error. Check console for details.');
      }
    } finally {
      setIsSubmitting(false);
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
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
