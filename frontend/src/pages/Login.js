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
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/token/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);

      const userResponse = await axios.get('http://localhost:8000/api/users/me/', {
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
      });
      const user = userResponse.data;
      console.log('Login: Setting user in AuthContext:', user);
      setUser(user);

      // Treat superusers as admins for redirection
      const effectiveRole = user.is_superuser ? 'admin' : user.role;

      switch (effectiveRole) {
        case 'admin':
          console.log('Login: Redirecting to /dashboard/admin');
          navigate('/dashboard/admin');
          break;
        case 'teacher':
          console.log('Login: Redirecting to /dashboard/teacher');
          navigate('/dashboard/teacher');
          break;
        case 'parent':
          console.log('Login: Redirecting to /dashboard/parent');
          navigate('/dashboard/parent');
          break;
        case 'student':
          console.log('Login: Redirecting to /dashboard/student');
          navigate('/dashboard/student');
          break;
        case 'staff':
          console.log('Login: Redirecting to /dashboard/staff');
          navigate('/dashboard/staff');
          break;
        default:
          console.log('Login: Redirecting to /');
          navigate('/');
      }
    } catch (err) {
      console.error('Login error details:', err.response ? err.response : err.message);
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else if (err.response && err.response.status === 404) {
        setError('User profile endpoint (/api/users/me/) not found. Please ensure the backend is running and configured correctly.');
      } else {
        setError('An error occurred during login. Check the console for details.');
      }
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
