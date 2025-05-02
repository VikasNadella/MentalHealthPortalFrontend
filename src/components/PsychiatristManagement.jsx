import { useState, useEffect } from 'react';
import axios from 'axios';

const PsychiatristManagement = () => {
  const [psychiatrists, setPsychiatrists] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPsychiatrists = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/psychiatrists', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPsychiatrists(response.data);
      } catch (err) {
        setError('Failed to fetch psychiatrists');
      }
    };
    fetchPsychiatrists();
  }, []);

  const handleConnect = async (psychiatristId) => {
    try {
      await axios.post(
        `http://localhost:3001/api/psychiatrists/${psychiatristId}/connect`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Connection request sent!');
    } catch (err) {
      setError('Failed to send connection request');
    }
  };

  const styled = {
    container: {
      padding: '2rem',
    },
    psychiatrist: {
      border: '1px solid #ccc',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '4px',
    },
    button: {
      padding: '0.8rem 1.5rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '0.5rem 0',
    },
    error: {
      color: 'red',
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styled.container}>
      <h2>Psychiatrist Management</h2>
      {error && <p style={styled.error}>{error}</p>}
      {psychiatrists.map(psychiatrist => (
        <div key={psychiatrist._id} style={styled.psychiatrist}>
          <p><strong>{psychiatrist.name}</strong></p>
          <p>Specialization: {psychiatrist.specialization}</p>
          <p>Contact: {psychiatrist.contact}</p>
          <button
            style={styled.button}
            onClick={() => handleConnect(psychiatrist._id)}
          >
            Connect
          </button>
        </div>
      ))}
    </div>
  );
};

export default PsychiatristManagement;