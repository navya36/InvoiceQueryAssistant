import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Card, CardContent, CardHeader, CardMedia } from '@mui/material';

function History({ email }) { // Accept userEmail as prop
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChatHistory();
  }, [email]); // Trigger fetchChatHistory when userEmail changes

  const fetchChatHistory = () => {
    setLoading(true);
    // Fetch chat history specific to the logged-in user
    fetch(`http://192.168.100.191:5000/api/get_chat_history?email=${email}`)
      .then(response => response.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching chat history:', error);
        setLoading(false);
      });
  };

  return (
    <div className="chat-container">
      <Typography variant="h5" gutterBottom>History Details:</Typography>
      {loading && <CircularProgress />}
      {history.map((entry, index) => (
        <Card key={index} className="history-entry" style={{ marginTop: 10 }}>
          <CardMedia
            component="img"
            src={`data:image/png;base64,${entry.image}`}
            alt="Uploaded"
            style={{ width: 150, height: 'auto', margin: 'auto' }}
          />
          <CardHeader title="Query:" />
          <CardContent>
            <Typography variant="body1">{entry.query}</Typography>
          </CardContent>
          <CardHeader title="Response:" />
          <CardContent>
            <Typography variant="body1">{entry.response}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default History;
