// Login component - handles user authentication
import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');  // Username input
  const [password, setPassword] = useState('');  // Password input
  const [error, setError] = useState('');  // Error message display

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    try {
      // Request JWT tokens from backend
      const response = await axios.post('http://localhost:8000/api/token/', { username, password });
      // Store tokens in localStorage for subsequent API requests
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      onLogin();  // Notify parent component of successful login
    } catch (err) {
      setError('Invalid credentials');  // Show error on failed login
    }
  };

  // Render login form
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>Login</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}  {/* Show error if login fails */}
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Login</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
