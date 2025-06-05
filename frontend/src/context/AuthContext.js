import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Checking for token on mount or user change');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('AuthProvider: Token found, fetching user');
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/users/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('AuthProvider: User fetched:', response.data);
          setUser(response.data);
        } catch (err) {
          console.error('AuthProvider: Error fetching user:', err.response?.data || err.message);
          localStorage.removeItem('token');
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      console.log('AuthProvider: No token found');
      setLoading(false);
    }
  }, []); // Empty dependency array for initial mount only

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
