import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Typography, CircularProgress, IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Bill from './Bill';
import History from './History';
import './Signup.css';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [email, setEmail] = useState(''); // Initialize userEmail state
  const [showHistory, setShowHistory] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://192.168.100.191:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (response.ok) {
          setLoginSuccess(true);
          setEmail(formData.email);  // Set the logged-in user's email
        } else {
          alert('Invalid credentials');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Login failed');
      });
  };

  const handleLogout = () => {
    setLoginSuccess(false);
    setEmail('');
    setShowHistory(false); // Hide history when logging out
  };
  
  const handleHistoryButtonClick = () => {
    setShowHistory(prevState => !prevState);
  };

  return (
    <div className="login-container">
      <div className="left-half">
        {loginSuccess && (
          <div className="history-button-container">
            <button onClick={handleHistoryButtonClick}>
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
        )}
        <div className="history-container">
          {showHistory && <History email={email} />}
        </div>
      </div>
      <div className="right-half">
        <div className="bill-container">
          <div className="signup-container">
            {!loginSuccess ? (
              <form onSubmit={handleSubmit} className="registration-form"> 
                <div>
                  <h2>Login Form</h2>
                </div>
                <div>
                  <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </label>
                </div>
                <div>
                  <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                  </label>
                </div>
                <button type="submit">Login</button>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Bill email={email} />
              </div>
            )}
          </div>
        </div>
      </div>
      {loginSuccess && (
        <div className="logout-container" style={{ marginLeft: 'auto' }}>
          <IconButton onClick={handleLogout}>
            Logout
            <ExitToAppIcon />
          </IconButton>
        </div>
      )}

    </div>
  );
}

export default Login;
