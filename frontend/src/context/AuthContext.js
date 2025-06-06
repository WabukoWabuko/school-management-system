import React, { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.data?.id || !response.data?.role) {
          throw new Error('Invalid user data');
        }
        setUser(response.data);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
        toast.error('Session expired or invalid. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/users/login/', credentials);
      const { token, user: userData } = response.data;
      if (!token || !userData?.id || !userData?.role) {
        throw new Error('Invalid login response');
      }
      localStorage.setItem('token', token);
      setUser(userData);
      toast.success('Logged in successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const contextValue = useMemo(() => ({
    user,
    setUser,
    loading,
    login,
    logout,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
};
