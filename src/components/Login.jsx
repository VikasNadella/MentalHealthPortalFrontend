import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Animation keyframes
const fadeIn = {
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  },
  animation: 'fadeIn 0.5s ease-in-out'
};

const pulse = {
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' }
  },
  animation: 'pulse 2s infinite'
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const styled = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'flex-end',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundImage: 'url("/login_image.avif")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    rightPanel: {
      width: '40%',
      minWidth: '400px',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backdropFilter: 'blur(8px)',
    },
    card: {
      width: '100%',
      maxWidth: '380px',
      padding: '2.5rem',
      backgroundColor: 'rgba(40, 50, 70, 0.6)',
      backdropFilter: 'blur(4px)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      color: 'white',
      textAlign: 'center',
      ...fadeIn
    },
    heading: {
      fontSize: '1.8rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      animation: 'fadeIn 0.5s ease-in-out'
    },
    subheading: {
      fontSize: '0.95rem',
      opacity: 0.8,
      marginBottom: '2rem',
      animation: 'fadeIn 0.5s ease-in-out 0.1s',
      animationFillMode: 'both'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
      animation: 'fadeIn 0.5s ease-in-out 0.2s',
      animationFillMode: 'both'
    },
    input: {
      padding: '0.9rem 1.2rem',
      backgroundColor: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      '&:focus': {
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: '0 0 0 3px rgba(255,255,255,0.1)'
      }
    },
    button: {
      padding: '0.9rem',
      marginTop: '0.5rem',
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      animation: 'fadeIn 0.5s ease-in-out 0.3s',
      animationFillMode: 'both',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.3)',
        ...pulse
      }
    },
    footer: {
      marginTop: '1.8rem',
      fontSize: '0.9rem',
      color: 'rgba(255,255,255,0.8)',
      animation: 'fadeIn 0.5s ease-in-out 0.4s',
      animationFillMode: 'both'
    },
    link: {
      color: 'white',
      fontWeight: '600',
      textDecoration: 'none',
      marginLeft: '0.3rem',
      transition: 'all 0.3s ease',
      '&:hover': {
        textDecoration: 'underline',
        textUnderlineOffset: '3px'
      }
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.85rem',
      marginTop: '0.5rem',
      textAlign: 'center',
      animation: 'fadeIn 0.3s ease-in-out'
    }
  };

  return (
    <div style={styled.container}>
      <div style={styled.overlay} />
      <div style={styled.rightPanel}>
        <div style={styled.card}>
          <h2 style={styled.heading}>Welcome Back</h2>
          <p style={styled.subheading}>Sign in to continue your journey</p>
          
          <form style={styled.form} onSubmit={handleSubmit}>
            <input
              style={styled.input}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              style={styled.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              style={styled.button}
              type="submit"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              Continue
            </button>
            {error && <div style={styled.error}>{error}</div>}
          </form>

          <div style={styled.footer}>
            New to our platform? <Link to="/register" style={styled.link}>Register now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;