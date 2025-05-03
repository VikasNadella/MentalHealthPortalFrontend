import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'music', url: '' });
  const [error, setError] = useState('');
  const [hoveredMaterial, setHoveredMaterial] = useState(null);
  const [accessError, setAccessError] = useState('');
  const [redirectPopup, setRedirectPopup] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isPsychiatrist, setIsPsychiatrist] = useState(false);

  useEffect(() => {
    // Decode JWT token to get userId and isPsychiatrist
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
        setIsPsychiatrist(payload.isPsychiatrist || false);
      } catch (err) {
        setError('Failed to verify user role. Please log in again.');
      }
    }

    const fetchMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/materials');
        setMaterials(response.data);
      } catch (err) {
        setError('Failed to fetch materials');
      }
    };
    fetchMaterials();
  }, []);

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/materials', {
        userId,
        title: newMaterial.title,
        type: newMaterial.type,
        url: newMaterial.url,
      });
      setMaterials([response.data, ...materials]);
      setNewMaterial({ title: '', type: 'music', url: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add material');
    }
  };

  const handleApprove = async (materialId) => {
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:3001/api/materials/${materialId}/approve`, { userId });
      setMaterials(materials.map(material => material._id === materialId ? response.data : material));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve material');
    }
  };

  const handleAccessMaterial = (material) => {
    if (!material.isApproved && !isPsychiatrist) {
      setAccessError('Please wait until this material is approved by a psychiatrist.');
      setTimeout(() => setAccessError(''), 3000);
      return;
    }

    setRedirectPopup(material.url);
  };

  const confirmRedirect = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setRedirectPopup(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #075985 100%)',
      padding: '2rem',
      fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'sans-serif'",
      boxSizing: 'border-box',
      margin: 0,
      overflowY: 'auto',
      position: 'relative',
      color: '#e0f2fe',
    }}>
      {/* Subtle Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 2px, transparent 2px)',
        backgroundSize: '20px 20px',
        opacity: 0.15,
        zIndex: 0,
      }} />

      {/* Access Error Popup */}
      {accessError && (
        <div style={{
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
        }}>
          <div style={{
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
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>⚠️</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Access Restricted</h3>
            </div>
            <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>{accessError}</p>
            <button
              onClick={() => setAccessError('')}
              style={{
                padding: '0.5rem 1.5rem',
                background: '#3b82f6',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Redirect Confirmation Popup */}
      {redirectPopup && (
        <div style={{
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
        }}>
          <div style={{
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
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🔗</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>External Site Redirect</h3>
            </div>
            <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
              You will be redirected to an external site. Do you want to proceed?
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
            }}>
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
                onMouseEnter={(e) => e.currentTarget.style.background = '#16a34a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
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
                onMouseEnter={(e) => e.currentTarget.style.background = '#4b5563'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#6b7280'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section with Back Button and Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <Link to="/dashboard" style={{
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
        }}>
          Back to Dashboard
        </Link>

        <header style={{
          textAlign: 'center',
          animation: 'pulse 2s infinite ease-in-out',
          flex: 1,
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#e0f2fe',
            textShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
            letterSpacing: '1px',
            margin: 0,
          }}>
            Material Haven
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#93c5fd',
            fontWeight: '300',
            margin: '0.5rem 0 0 0',
          }}>
            Explore and contribute to a sanctuary of calming resources.
          </p>
        </header>

        <div style={{ width: '150px' }}></div> {/* Spacer for balance */}
      </div>

      {error && (
        <div role="alert" style={{
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
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleMaterialSubmit} style={{
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
      }}>
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
          placeholder="Enter material title..."
          value={newMaterial.title}
          onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          required
        />
        <select
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
          value={newMaterial.type}
          onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
        >
          <option value="music">Music</option>
          <option value="reading">Reading</option>
          <option value="video">Video</option>
          <option value="meditation">Meditation</option>
          <option value="podcast">Podcast</option>
        </select>
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
          placeholder="Enter material URL..."
          value={newMaterial.url}
          onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: '0.8rem 2rem',
            background: 'linear-gradient(90deg, #3b82f6 0%, #1e3a8a 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            display: 'block',
            margin: '0 auto',
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
          Add Material
        </button>
      </form>
      <style>
        {`
          input::placeholder {
            color: #bfdbfe;
            opacity: 1;
          }
        `}
      </style>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(250px, 1fr))',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {materials.map((material, index) => (
          <div
            key={material._id}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
              border: `1px solid ${hoveredMaterial === index ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.3)'}`,
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              boxSizing: 'border-box',
              animation: `slideIn 0.5s ease forwards ${index * 0.2}s`,
              opacity: 0,
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={() => setHoveredMaterial(index)}
            onMouseLeave={() => setHoveredMaterial(null)}
          >
            <p style={{
              fontWeight: '600',
              color: '#e0f2fe',
              fontSize: '1.2rem',
              marginBottom: '0.5rem',
            }}>
              {material.title} ({material.type})
            </p>
            <button
              onClick={() => handleAccessMaterial(material)}
              style={{
                padding: '0.6rem 1.5rem',
                background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                marginBottom: '0.5rem',
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
              Access Material
            </button>
            <p style={{
              color: '#93c5fd',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
            }}>
              Submitted by: {material.user.fullName}
            </p>
            <p style={{
              color: '#93c5fd',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}>
              Status: <span style={{ color: material.isApproved ? '#22c55e' : '#f59e0b' }}>
                {material.isApproved ? 'Approved' : 'Pending'}
              </span>
            </p>
            {isPsychiatrist && !material.isApproved && (
              <button
                style={{
                  padding: '0.6rem 1.5rem',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #1e3a8a 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
                }}
                onClick={() => handleApprove(material._id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                }}
              >
                Approve
              </button>
            )}
          </div>
        ))}
      </div>

      <style>
        {`
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
            boxSizing: border-box;
          }
        `}
      </style>
    </div>
  );
};

export default MaterialManagement;