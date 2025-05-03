import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SupportSessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ title: '', date: '', description: '', link: '' });
  const [feedbackBySession, setFeedbackBySession] = useState({});
  const [error, setError] = useState('');
  const [hoveredSession, setHoveredSession] = useState(null);
  const [redirectPopup, setRedirectPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem('token')
    ? JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
    : null;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/sessions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSessions(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3001/api/sessions',
        newSession,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSessions([response.data, ...sessions]);
      setNewSession({ title: '', date: '', description: '', link: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (sessionId, sessionLink) => {
    if (!sessionLink) {
      setError('No session link available');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3001/api/sessions/${sessionId}/join`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSessions(sessions.map((session) => (session._id === sessionId ? response.data.session : session)));
      setRedirectPopup(sessionLink);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join session');
    } finally {
      setLoading(false);
    }
  };

  const confirmRedirect = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setRedirectPopup(null);
  };

  const handleFeedbackSubmit = async (sessionId) => {
    const feedbackContent = feedbackBySession[sessionId] || '';
    if (!feedbackContent.trim()) {
      setError('Feedback cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3001/api/sessions/${sessionId}/feedback`,
        { content: feedbackContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSessions(sessions.map((session) => (session._id === sessionId ? response.data : session)));
      setFeedbackBySession((prev) => ({ ...prev, [sessionId]: '' }));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const truncateLink = (link, maxLength = 30) => {
    if (!link) return '';
    return link.length > maxLength ? `${link.slice(0, maxLength)}...` : link;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #075985 100%)',
        padding: '2rem',
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'sans-serif'",
        boxSizing: 'border-box',
        margin: 0,
        overflowY: 'auto',
        position: 'relative',
        color: '#e0f2fe',
      }}
    >
      {/* Subtle Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 2px, transparent 2px)',
          backgroundSize: '20px 20px',
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      {/* Redirect Confirmation Popup */}
      {redirectPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 50,
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #0284c7 100%)',
              color: '#e0f2fe',
              padding: '2rem',
              borderRadius: '15px',
              maxWidth: '24rem',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              border: '1px solid #3b82f6',
              transform: 'scale(1)',
              animation: 'popIn 0.3s ease-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🔗</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Join Session</h3>
            </div>
            <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
              You will be redirected to the session's external link. Do you want to proceed?
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              <button
                onClick={() => confirmRedirect(redirectPopup)}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#22c55e',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#16a34a')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
              >
                Proceed
              </button>
              <button
                onClick={() => setRedirectPopup(null)}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#6b7280',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#4b5563')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#6b7280')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section with Back Button and Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Link
          to="/dashboard"
          style={{
            padding: '0.7rem 1.5rem',
            background: 'linear-gradient(90deg, #3b82f6 0%, #1e3a8a 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
          }}
        >
          Back to Dashboard
        </Link>

        <header
          style={{
            textAlign: 'center',
            animation: 'pulse 2s infinite ease-in-out',
            flex: 1,
          }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#e0f2fe',
              textShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
              letterSpacing: '1px',
              margin: 0,
            }}
          >
            Support Sessions
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#93c5fd',
              fontWeight: '300',
              margin: '0.5rem 0 0 0',
            }}
          >
            Connect, share, and grow through supportive group sessions.
          </p>
        </header>

        <div style={{ width: '150px' }}></div> {/* Spacer for balance */}
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          style={{
            padding: '1rem',
            background: 'rgba(220, 38, 38, 0.2)',
            color: '#f87171',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #f87171',
            maxWidth: '500px',
            margin: '0 auto 1.5rem',
            boxSizing: 'border-box',
            backdropFilter: 'blur(5px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Session Creation Form (Visible to Psychiatrists Only) */}
      {user?.isPsychiatrist && (
        <form
          onSubmit={handleSessionSubmit}
          style={{
            maxWidth: '600px',
            margin: '0 auto 2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            boxSizing: 'border-box',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <input
            style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '10px',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e0f2fe',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
            type="text"
            placeholder="Enter session title..."
            value={newSession.title}
            onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            required
            disabled={loading}
          />
          <input
            style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '10px',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e0f2fe',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
            type="datetime-local"
            value={newSession.date}
            onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            required
            disabled={loading}
          />
          <textarea
            style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '10px',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e0f2fe',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              minHeight: '100px',
            }}
            placeholder="Enter session description..."
            value={newSession.description}
            onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            required
            disabled={loading}
          />
          <input
            style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '10px',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e0f2fe',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
            type="url"
            placeholder="Enter session link (e.g., Zoom, Google Meet)..."
            value={newSession.link}
            onChange={(e) => setNewSession({ ...newSession, link: e.target.value })}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            required
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              padding: '0.8rem 2rem',
              background: 'linear-gradient(90deg, #3b82f6 0%, #1e3a8a 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              display: 'block',
              margin: '0 auto',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
            }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Session'}
          </button>
        </form>
      )}

      {/* Session List */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {sessions.map((session, index) => (
          <div
            key={session._id}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
              border: `1px solid ${
                hoveredSession === index ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.3)'
              }`,
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              boxSizing: 'border-box',
              animation: `slideIn 0.5s ease forwards ${index * 0.2}s`,
              opacity: 0,
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={() => setHoveredSession(index)}
            onMouseLeave={() => setHoveredSession(null)}
          >
            <p
              style={{
                fontWeight: '600',
                color: '#e0f2fe',
                fontSize: '1.2rem',
                marginBottom: '0.5rem',
              }}
            >
              {session.title}
            </p>
            <p
              style={{
                color: '#93c5fd',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
              }}
            >
              Date: {new Date(session.date).toLocaleString()}
            </p>
            <p
              style={{
                color: '#93c5fd',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
              }}
            >
              Host: {session.psychiatrist?.fullName || 'Unknown'}
            </p>
            {user?.isPsychiatrist && (
              <p
                style={{
                  color: '#93c5fd',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                }}
              >
                Link: <a href={session.link} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{truncateLink(session.link)}</a>
              </p>
            )}
            <p
              style={{
                color: '#e0f2fe',
                fontSize: '1rem',
                marginBottom: '1rem',
              }}
            >
              {session.description}
            </p>
            {!user?.isPsychiatrist && (
              <button
                onClick={() => handleJoin(session._id, session.link)}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  marginBottom: '1rem',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                }}
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join Session'}
              </button>
            )}
            <div>
              <textarea
                style={{
                  width: '100%',
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#e0f2fe',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  minHeight: '80px',
                }}
                placeholder="Add feedback..."
                value={feedbackBySession[session._id] || ''}
                onChange={(e) =>
                  setFeedbackBySession((prev) => ({ ...prev, [session._id]: e.target.value }))
                }
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                disabled={loading}
              />
              <button
                onClick={() => handleFeedbackSubmit(session._id)}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #1e3a8a 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
            {session.feedback?.map((fb, fbIndex) => (
              <p
                key={fbIndex}
                style={{
                  color: '#93c5fd',
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                }}
              >
                <strong>{fb.user?.fullName || 'Unknown'}</strong>: {fb.content}
              </p>
            ))}
          </div>
        ))}
      </div>

      <style>
        {`
          input::placeholder,
          textarea::placeholder {
            color: #bfdbfe;
            opacity: 1;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes popIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            box-sizing: border-box;
          }
        `}
      </style>
    </div>
  );
};

export default SupportSessionManagement;