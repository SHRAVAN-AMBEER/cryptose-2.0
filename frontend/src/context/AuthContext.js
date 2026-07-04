"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) throw new Error('No user email stored');
      
      const response = await api.get(`/profile?email=${email}`);
      if (response.data && !response.data.error) {
        // Map _id to id if necessary, though profile route returns direct object
        setUser({ ...response.data, id: response.data._id || response.data.id });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('token', 'dummy-token'); // In production, this would be a JWT
        localStorage.setItem('userEmail', data.user.email);
        return { success: true, user: data.user };
      }
      
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  const register = async (userData, type) => {
    try {
      console.log('Starting registration process:', { type, email: userData.email });
      
      // First check if email exists using the api utility
      const checkResponse = await api.post('/check-email', { email: userData.email });
      console.log('Email check response:', checkResponse.data);
      
      if (checkResponse.data.exists) {
        console.log('Email already exists');
        return {
          success: false,
          error: 'Account already exists. Please go to the login page.'
        };
      }

      // If email doesn't exist, proceed with registration using api utility
      console.log('Proceeding with registration:', { type });
      const response = await api.post(`/register/${type}`, userData);
      console.log('Registration response:', response.data);
      
      if (response.status === 201) {
        return { success: true };
      }
      return { success: false, error: response.data.error || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const forgotPassword = async (email, newPassword) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      
      const data = await response.json();
      return {
        success: data.success,
        message: data.message,
        error: data.error
      };
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, error: 'Password reset failed' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};