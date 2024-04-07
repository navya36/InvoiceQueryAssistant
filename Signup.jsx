import React, { useState } from 'react';
import './Signup.css'; 

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    fetch('http://192.168.100.191:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (response.ok) {
          alert('Registration successful');
          setRegistrationSuccess(true);
        } else {
          alert('Registration failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Registration failed');
      });
  };

  return (
    <div className="signup-container">
      {!registrationSuccess ? (
        <form onSubmit={handleSubmit} className="registration-form">
          <h2>Registration Form</h2>
          <div>
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Phone:
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Confirm Password:
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </label>
          </div>
          <button type="submit">Register</button>
        </form>
      ) : (
        <div>
          <p>Registration successful! You can now log in.</p>
          {/* You can add any additional content or components here */}
        </div>
      )}
    </div>
  );
}

export default Signup;
