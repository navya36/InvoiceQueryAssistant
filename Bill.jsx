import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Typography, CircularProgress } from '@mui/material';

function Bill({ email }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    const fileUrl = URL.createObjectURL(event.target.files[0]);
    setImageUrl(fileUrl);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !query) {
      setError('Please select an image and enter a query.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('query', query);
    formData.append('email', email); // Add user's email to the FormData object

    try {
      const response = await fetch(`http://192.168.100.191:5000/api/billqna?email=${email}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        setError('No response received.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Grid>
        {imageUrl && (
          <Grid item xs={12}>
            <img src={imageUrl} alt="Uploaded Invoice" style={{ maxWidth: '100%', height: 'auto', width: '250px' }} />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            placeholder="Enter your query"
            value={query}
            onChange={handleInputChange}
            fullWidth
            style={{ width: '60%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h6">Response:</Typography>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Typography>{response}</Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Bill;
