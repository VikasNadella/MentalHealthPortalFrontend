import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data);
      } catch {
        setError('Failed to fetch user data');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [hovered, setHovered] = useState(null);

  return (
    <main
      style={{
        maxWidth: 960,
        margin: '2rem auto',
        padding: '2rem',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        borderRadius: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
        textAlign: 'center',
      }}
      aria-label="User Dashboard"
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>
        Welcome, {user?.fullName} 👋
      </h1>
      {error && (
        <p role="alert" style={{ color: '#e63946', fontWeight: 600, marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      <nav
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
        aria-label="Dashboard navigation"
      >
        {[
          { to: '/posts', label: 'Manage Posts' },
          { to: '/materials', label: 'Manage Materials' },
          { to: '/psychiatrists', label: 'Find Psychiatrists' },
          { to: '/sessions', label: 'Support Sessions' },
        ].map(({ to, label }, i) => (
          <Link
            key={to}
            to={to}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'block',
              padding: '1rem 0',
              backgroundColor: hovered === i ? '#5a54d1' : '#6c63ff',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: hovered === i ? '0 8px 24px rgba(108, 99, 255, 0.5)' : '0 4px 12px rgba(108, 99, 255, 0.3)',
              transition: 'all 0.3s ease',
              userSelect: 'none',
            }}
            aria-label={`Navigate to ${label}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        style={{
          marginTop: '3rem',
          padding: '0.9rem 2rem',
          backgroundColor: '#ff6f91',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          borderRadius: 30,
          cursor: 'pointer',
          fontSize: '1.1rem',
          boxShadow: '0 6px 20px rgba(255, 111, 145, 0.4)',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          userSelect: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#ff3b68';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 59, 104, 0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#ff6f91';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 111, 145, 0.4)';
        }}
        aria-label="Logout"
      >
        Logout
      </button>
    </main>
  );
};

export default Dashboard;
