// Main App component - handles authentication and role-based routing
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Dashboard from './Dashboard';
import WarehouseDashboard from './WarehouseDashboard';
import SalesDashboard from './SalesDashboard';

function App() {
  // Check if user is authenticated by looking for access token in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);  // Store current user data
  const [loading, setLoading] = useState(true);  // Loading state while fetching user

  // Fetch user data when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch current user details from API
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }  // Send JWT token
      });
      setUser(response.data);
    } catch (err) {
      handleLogout();  // If token is invalid, log out
    }
    setLoading(false);
  };

  // Called after successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Clear tokens and user data on logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Show nothing while loading user data
  if (loading) return null;

  // Show login page if not authenticated
  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  // Determine user role from user data
  const isAdmin = user?.is_staff;  // Admin users have is_staff=true
  const isWarehouseManager = user?.groups?.some(g => g.name === 'Warehouse Manager');
  const isSalesRep = user?.groups?.some(g => g.name === 'Sales Rep');

  // Route to appropriate dashboard based on user role
  if (isAdmin) {
    return <Dashboard onLogout={handleLogout} />;  // Full admin dashboard
  } else if (isWarehouseManager) {
    return <WarehouseDashboard user={user} onLogout={handleLogout} />;  // Warehouse-specific view
  } else if (isSalesRep) {
    return <SalesDashboard user={user} onLogout={handleLogout} />;  // Sales-specific view
  }

  // Default to admin dashboard
  return <Dashboard onLogout={handleLogout} />;
}

export default App;
