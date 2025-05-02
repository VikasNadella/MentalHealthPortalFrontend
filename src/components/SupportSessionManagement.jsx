import { useState, useEffect } from 'react';
import axios from 'axios';

const SupportSessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ title: '', date: '', description: '' });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const user = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/sessions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSessions(response.data);
      } catch (err) {
        setError('Failed to fetch sessions');
      }
    };
    fetchSessions();
  }, []);

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/api/sessions',
        newSession,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSessions([response.data, ...sessions]);
      setNewSession({ title: '', date: '', description: '' });
      setError('');
    } catch (err) {
      setError('Failed to create session');
    }
  };

  const handleJoin = async (sessionId) => {
    try {
      await axios.post(
        `http://localhost:3001/api/sessions/${sessionId}/join`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Joined session successfully!');
    } catch (err) {
      setError('Failed to join session');
    }
  };

  const handleFeedbackSubmit = async (sessionId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/sessions/${sessionId}/feedback`,
        { content: feedback },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSessions(sessions.map(session => session._id === sessionId ? response.data : session));
      setFeedback('');
      setError('');
    } catch (err) {
      setError('Failed to submit feedback');
    }
  };

  const styled = {
    container: {
      padding: '2rem',
    },
    form: {
      marginBottom: '2rem',
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      margin: '0.5rem 0',
      border: '1px solid #ccc',
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
    session: {
      border: '1px solid #ccc',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '4px',
    },
    feedback: {
      marginLeft: '1rem',
      fontSize: '0.9rem',
      color: '#555',
    },
    error: {
      color: 'red',
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styled.container}>
      <h2>Support Sessions & Campaigns</h2>
      {error && <p style={styled.error}>{error}</p>}
      {user?.isPsychiatrist && (
        <form style={styled.form} onSubmit={handleSessionSubmit}>
          <input
            style={styled.input}
            type="text"
            placeholder="Session Title"
            value={newSession.title}
            onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
            required
          />
          <input
            style={styled.input}
            type="datetime-local"
            value={newSession.date}
            onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
            required
          />
          <textarea
            style={styled.input}
            placeholder="Description"
            value={newSession.description}
            onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
            required
          />
          <button style={styled.button} type="submit">Create Session</button>
        </form>
      )}
      {sessions.map(session => (
        <div key={session._id} style={styled.session}>
          <p><strong>{session.title}</strong></p>
          <p>Date: {new Date(session.date).toLocaleString()}</p>
          <p>{session.description}</p>
          {!user?.isPsychiatrist && (
            <button
              style={styled.button}
              onClick={() => handleJoin(session._id)}
            >
              Join Session
            </button>
          )}
          <div>
            <textarea
              style={styled.input}
              placeholder="Add feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button
              style={styled.button}
              onClick={() => handleFeedbackSubmit(session._id)}
            >
              Submit Feedback
            </button>
          </div>
          {session.feedback.map((fb, index) => (
            <p key={index} style={styled.feedback}>
              <strong>{fb.user.fullName}</strong>: {fb.content}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SupportSessionManagement;