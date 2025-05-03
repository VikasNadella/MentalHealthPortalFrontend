import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PsychiatristConnect = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    senderEmail: '',
    concern: '',
    timing: '',
  });
  const [formError, setFormError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCurrentUserPsychiatrist, setIsCurrentUserPsychiatrist] = useState(false);

  useEffect(() => {
    // Decode JWT token to check if the user is a psychiatrist
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsCurrentUserPsychiatrist(payload.isPsychiatrist || false);
      } catch (err) {
        setError('Failed to verify user role. Please log in again.');
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/public-users');
        // Filter users based on the logged-in user's role
        const filteredUsers = response.data.filter(user => 
          isCurrentUserPsychiatrist ? !user.isPsychiatrist : user.isPsychiatrist
        );
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [isCurrentUserPsychiatrist]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: '',
        contact: '',
        senderEmail: '',
        concern: '',
        timing: '',
      });
      setFormError('');
      setIsEmailSent(false);
    }
  }, [selectedUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.contact.trim()) return 'Contact number is required';
    if (!formData.senderEmail.trim()) return 'Email is required';
    if (!emailRegex.test(formData.senderEmail)) return 'Please enter a valid email address';
    if (!formData.concern.trim()) return 'Concern is required';
    if (!formData.timing.trim()) return 'Available timing is required';
    return '';
  };

  const sendEmailToUser = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/users/send-consultation', {
        patientEmail: selectedUser.email,
        patientName: selectedUser.fullName,
        doctorName: formData.name,
        contact: formData.contact,
        email: formData.senderEmail,
        concern: formData.concern,
        timing: formData.timing,
      });

      if (response.status === 200) {
        setIsEmailSent(true);
        setTimeout(() => {
          setSelectedUser(null);
          setIsEmailSent(false);
          setFormData({ name: '', contact: '', senderEmail: '', concern: '', timing: '' });
        }, 3000);
      } else {
        setFormError('Failed to send email. Please try again.');
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to send email. Please try again.');
    }
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setFormData({ name: '', contact: '', senderEmail: '', concern: '', timing: '' });
    setFormError('');
    setIsEmailSent(false);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#e0f2fe',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #075985 100%)',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(255, 255, 255, 0.2)',
          borderTop: '5px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
        <p>Loading users...</p>
      </div>
    );
  }

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
            Connect with {isCurrentUserPsychiatrist ? 'Patients' : 'Psychiatrists'}
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#93c5fd',
            fontWeight: '300',
            margin: '0.5rem 0 0 0',
          }}>
            Reach out to a {isCurrentUserPsychiatrist ? 'patient' : 'psychiatrist'} to schedule a consultation and provide support.
          </p>
        </header>

        <div style={{ width: '150px' }}></div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        width: '85%',
        maxWidth: '1200px',
        height: '70vh',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        margin: '0 auto',
      }}>
        <motion.div
          style={{
            flex: 1,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            overflowY: 'auto',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #fff, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}>
            Our {isCurrentUserPsychiatrist ? 'Patients' : 'Psychiatrists'}
          </div>
          <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontSize: '1rem',
                color: '#e0f2fe',
                transition: 'all 0.3s ease',
              }}
              placeholder={`Search ${isCurrentUserPsychiatrist ? 'patients' : 'psychiatrists'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.2rem',
            }} className="fas fa-search"></i>
          </div>
          {error && (
            <div style={{
              color: '#fecaca',
              margin: '1rem 0',
              textAlign: 'center',
              padding: '0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}
          {filteredUsers.length === 0 ? (
            <div style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
            }}>
              No {isCurrentUserPsychiatrist ? 'patients' : 'psychiatrists'} found.
            </div>
          ) : (
            filteredUsers.map(user => (
              <motion.div
                key={user._id}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  marginBottom: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setSelectedUser(user)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#e0f2fe',
                }}>
                  {user.fullName}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                  {user.isPsychiatrist ? 'Psychiatrist' : 'Patient'}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                {user.email}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          style={{
            flex: 2,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!selectedUser ? (
            <>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                background: 'linear-gradient(to right, #fff, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}>
                Reach Out to {isCurrentUserPsychiatrist ? 'Patients' : 'Psychiatrists'}
              </div>
              <div style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '2rem',
                textAlign: 'center',
                lineHeight: '1.5',
              }}>
                Select a {isCurrentUserPsychiatrist ? 'patient' : 'psychiatrist'} to schedule a consultation and provide support.
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontSize: '1.9rem',
                fontWeight: '700',
                marginBottom: '1.8rem',
                color: '#e0f2fe',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}>
                Connect with {selectedUser.fullName}
              </div>
              {isEmailSent ? (
                <div style={{
                  color: '#22c55e',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginTop: '1.5rem',
                  textAlign: 'center',
                  background: 'rgba(74, 222, 128, 0.1)',
                  padding: '1rem',
                  borderRadius: '10px',
                }}>
                  Your message has been sent to {selectedUser.fullName}. They will respond soon.
                </div>
              ) : (
                <>
                  {formError && (
                    <div style={{
                      color: '#fecaca',
                      margin: '1rem 0',
                      textAlign: 'center',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                    }}>
                      {formError}
                    </div>
                  )}
                  <form style={{ width: '100%' }}>
                    <div style={{ marginBottom: '1.8rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '45%', textAlign: 'left' }}>
                        <label style={{
                          display: 'block',
                          color: '#e0f2fe',
                          marginBottom: '0.6rem',
                          fontWeight: '500',
                          fontSize: '1.1rem',
                        }}>
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #3b82f6',
                            borderRadius: '10px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            color: '#e0f2fe',
                            transition: 'all 0.3s ease',
                          }}
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: '45%', textAlign: 'left' }}>
                        <label style={{
                          display: 'block',
                          color: '#e0f2fe',
                          marginBottom: '0.6rem',
                          fontWeight: '500',
                          fontSize: '1.1rem',
                        }}>
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #3b82f6',
                            borderRadius: '10px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            color: '#e0f2fe',
                            transition: 'all 0.3s ease',
                          }}
                          placeholder="Enter your contact number"
                          required
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1.8rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '45%', textAlign: 'left' }}>
                        <label style={{
                          display: 'block',
                          color: '#e0f2fe',
                          marginBottom: '0.6rem',
                          fontWeight: '500',
                          fontSize: '1.1rem',
                        }}>
                          Your Email
                        </label>
                        <input
                          type="email"
                          name="senderEmail"
                          value={formData.senderEmail}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #3b82f6',
                            borderRadius: '10px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            color: '#e0f2fe',
                            transition: 'all 0.3s ease',
                          }}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: '45%', textAlign: 'left' }}>
                        <label style={{
                          display: 'block',
                          color: '#e0f2fe',
                          marginBottom: '0.6rem',
                          fontWeight: '500',
                          fontSize: '1.1rem',
                        }}>
                          Proposed Timing
                        </label>
                        <input
                          type="text"
                          name="timing"
                          value={formData.timing}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #3b82f6',
                            borderRadius: '10px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            color: '#e0f2fe',
                            transition: 'all 0.3s ease',
                          }}
                          placeholder="E.g., Weekdays 2-4 PM"
                          required
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1.8rem', textAlign: 'left' }}>
                      <label style={{
                        display: 'block',
                        color: '#e0f2fe',
                        marginBottom: '0.6rem',
                        fontWeight: '500',
                        fontSize: '1.1rem',
                      }}>
                        Consultation Details
                      </label>
                      <textarea
                        name="concern"
                        value={formData.concern}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.9rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid #3b82f6',
                          borderRadius: '10px',
                          boxSizing: 'border-box',
                          fontSize: '1rem',
                          color: '#e0f2fe',
                          transition: 'all 0.3s ease',
                          height: '80px',
                          resize: 'vertical',
                        }}
                        placeholder="Describe the consultation purpose"
                        required
                      ></textarea>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                      <button
                        type="button"
                        onClick={sendEmailToUser}
                        style={{
                          width: '48%',
                          padding: '1rem',
                          background: 'linear-gradient(to right, #3b82f6, #1e3a8a)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                          width: '48%',
                          padding: '1rem',
                          background: 'linear-gradient(to right, #ef4444, #f87171)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </motion.div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          input::placeholder, textarea::placeholder {
            color: #bfdbfe;
            opacity: 1;
          }
          input:focus, textarea:focus {
            outline: none;
            border-color: #3b82f6;
            background: rgba(255, 255, 255, 0.15);
            boxShadow: 0 0 10px rgba(59, 130, 246, 0.4);
          }
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            boxSizing: 'border-box';
          }
        `}
      </style>
    </div>
  );
};

export default PsychiatristConnect;