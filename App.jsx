import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Register from './components/Signup';
import Login from './components/Login';
import Bill from './components/Bill';
import About from './components/About';
import { Outlet } from 'react-router-dom';
import ReceiptIcon from '@mui/icons-material/Receipt';

const buttonContainerStyle = {
  marginLeft: 'auto',
};

const buttonStyle = {
  marginRight: '10px',
};

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            Invoice Query Assistant <ReceiptIcon sx={{ marginLeft: 1 }} />
          </Typography>
          {!isLoggedIn && !showLogin && !showSignup && (
            <div style={buttonContainerStyle}>
              <Button color="inherit" style={buttonStyle} onClick={handleLoginClick}>Login</Button>
              <Button color="inherit" style={buttonStyle} onClick={handleSignupClick}>Signup</Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        {/* {!showLogin && !showSignup && !isLoggedIn && <About />} */}
        {showLogin && <Login onLoginSuccess={setIsLoggedIn} />}
        {showSignup && <Register />}
        {isLoggedIn && <Bill />}
      </Container>
      <Outlet />
    </>
  );
};

export default App;
