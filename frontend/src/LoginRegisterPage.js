import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  AppBar,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Logo from './logo.png';
import BackgroundImage from './realestate-bg.jpg';

function LoginRegisterPage() {
  const [tabValue, setTabValue] = useState(0);  // 0 = login, 1 = register
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccessMessage('');
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const result = await res.json();
    setLoading(false);

    if (res.status === 200) {
      navigate('/main');
    } else {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    const result = await res.json();
    setLoading(false);

    if (res.status === 201) {
      setSuccessMessage('Registration successful! Please log in.');
    } else {
      setError(result.message);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds dark overlay
          zIndex: -1,
        },
      }}
    >
      <Card sx={{ width: 400, padding: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
        <CardContent>
          <AppBar position="static" sx={{ backgroundColor: '#3f51b5', padding: 2 }}>
            <Box display="flex" alignItems="center">
              <img src={Logo} alt="App Logo" style={{ width: 50, height: 50, marginRight: 8 }} />
              <Typography variant="h5">Real Estate App</Typography>
            </Box>
          </AppBar>

          {/* Tabs for Login and Register */}
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {/* Login Form */}
          {tabValue === 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>Login to your account</Typography>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                name="username"
                value={loginData.username}
                onChange={handleLoginInputChange}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                name="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && <Typography color="error" mt={2}>{error}</Typography>}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLoginSubmit}
                disabled={loading}
                sx={{ marginTop: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
              </Button>
            </Box>
          )}

          {/* Register Form */}
          {tabValue === 1 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>Create a new account</Typography>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                name="username"
                value={registerData.username}
                onChange={handleRegisterInputChange}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                name="password"
                value={registerData.password}
                onChange={handleRegisterInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && <Typography color="error" mt={2}>{error}</Typography>}
              {successMessage && <Typography color="primary" mt={2}>{successMessage}</Typography>}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegisterSubmit}
                disabled={loading}
                sx={{ marginTop: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "REGISTER"}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginRegisterPage;
