import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/api/users/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const currentUser = response.data.find((u) => u.username === 'WabukoWabuko'); // Mock user lookup
          setUser(currentUser || { role: 'unknown' });
        } catch (err) {
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
