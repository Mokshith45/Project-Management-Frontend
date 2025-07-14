import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../api/axios'; // Replace axios

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState('');

  const loadUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingUser(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      axiosInstance.get(`/api/users/${userId}`)
      .then(res => {
        setUser(res.data);
        setLoadingUser(false);
      })
      .catch(err => {
        setError('Failed to fetch user');
        setLoadingUser(false);
      });

    } catch (err) {
      setError('Invalid token');
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadUserFromToken(); // load once when app starts
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser, error, refreshUser: loadUserFromToken }}>
    {children}
    </UserContext.Provider>

  );
};
