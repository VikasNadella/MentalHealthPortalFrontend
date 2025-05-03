import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Sidebar Component
const Sidebar = ({ onLogout, user }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊', color: '#00dbde' },
    { to: '/posts', label: 'Posts', icon: '✍️', color: '#3b82f6' },
    { to: '/materials', label: 'Materials', icon: '📖', color: '#8b5cf6' },
    { to: '/psychiatrists', label: 'Psychiatrists', icon: '👨‍⚕️', color: '#10b981' },
    { to: '/sessions', label: 'Sessions', icon: '🕒', color: '#f59e0b' },
    { to: '/contact', label: 'Contact Us', icon: '📧', color: '#ef4444' },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Determine user status based on isPsychiatrist property
  const userStatus = user?.isPsychiatrist ? 'Psychiatrist' : 'Premium Member';

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '280px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 0',
        userSelect: 'none',
        zIndex: 100,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '1.8rem', 
          textAlign: 'center', 
          marginBottom: '1rem',
          background: 'linear-gradient(90deg, #00dbde 0%, #fc00ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1px'
        }}>
          MindCare Hub
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1rem',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00dbde 0%, #fc00ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{user?.fullName || 'User'}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{userStatus}</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, marginBottom: '0.5rem' }}>
        {navItems.map((item, i) => {
          const isHovered = hoveredIndex === i;
          const isActive = window.location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                background: isActive ? 'linear-gradient(90deg, rgba(0,219,222,0.2) 0%, rgba(252,0,255,0.2) 100%)' : 
                              isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderLeft: isActive ? `4px solid ${item.color}` : '4px solid transparent',
                fontSize: '1rem',
                gap: '1rem',
                margin: '0.5rem 1.5rem',
                borderRadius: '8px',
                boxSizing: 'border-box',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span style={{ 
                fontSize: '1.3rem', 
                transition: 'all 0.3s ease',
                background: isActive ? `linear-gradient(90deg, ${item.color} 0%, #fc00ff 100%)` : 'transparent',
                WebkitBackgroundClip: isActive ? 'text' : '',
                WebkitTextFillColor: isActive ? 'transparent' : ''
              }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={{ padding: '0 1.5rem' }}>
        <button
          onClick={() => setShowLogoutPopup(true)}
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '1.2rem',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            boxSizing: 'border-box',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          aria-label="Logout"
        >
          <i className="fas fa-sign-out-alt" style={{ fontSize: '1.2rem' }}></i> Logout
        </button>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e6f2 100%)',
              borderRadius: '12px',
              padding: '2rem',
              width: '400px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 0.3s ease-out',
              border: '1px solid #b3c5d3',
              color: '#1e293b',
              boxSizing: 'border-box',
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              See You Soon!
            </h3>
            <p style={{ 
              fontSize: '1rem',
              marginBottom: '1.5rem',
              lineHeight: '1.5'
            }}>
              Are you sure you want to logout? Your mental health journey is important to us.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowLogoutPopup(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#94a3b8',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#64748b';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#94a3b8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Stay
              </button>
              <button
                onClick={onLogout}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ posts: 0, materials: 0, sessions: 0, connections: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [greeting, setGreeting] = useState('Hello');
  const [dailyMotivation, setDailyMotivation] = useState('');
  const [showRedirectPopup, setShowRedirectPopup] = useState(false);

  const motivations = [
    "Taking care of your mental health is an act of self-love. Every small step you take today is a victory worth celebrating.",
    "You are stronger than you know. Embrace your journey with kindness and patience.",
    "Mental peace begins with a single breath. Take a moment for yourself today.",
    "Your mind deserves rest. Allow yourself to pause and recharge.",
    "Every challenge you face is a chance to grow. You’ve got this!"
  ];

  useEffect(() => {
    // Set appropriate greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Set random daily motivation on load
    setDailyMotivation(motivations[Math.floor(Math.random() * motivations.length)]);

    const fetchData = async () => {
      try {
        const [userRes, postsRes, materialsRes, sessionsRes, connectionsRes] = await Promise.all([
          axios.get('http://localhost:3001/api/users/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:3001/api/posts', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:3001/api/materials', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:3001/api/sessions', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:3001/api/psychiatrists', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        setUser(userRes.data);
        setStats({
          posts: postsRes.data.length,
          materials: materialsRes.data.length,
          sessions: sessionsRes.data.length,
          connections: connectionsRes.data.length,
        });
        setRecentPosts(postsRes.data.slice(0, 3));
        setRecentMaterials(materialsRes.data.slice(0, 3));
      } catch {
        setError('Failed to fetch data');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRedirect = () => {
    localStorage.removeItem('token');
    window.location.href = 'https://bbrfoundation.org/blog/everyday-mental-health-tips?gad_source=1&gad_campaignid=9734078768&gbraid=0AAAAADyJTkcQ1QdzL3ULP-Ujry4IXO6rN&gclid=Cj0KCQjw2tHABhCiARIsANZzDWq4nPPvUS0G1N1f_-sCJPRkvRSL8DlL0vRZyWepckhmSkQzs1K_cEwaAu5iEALw_wcB';
  };

  const summaryCards = [
    { 
      label: 'Active Posts', 
      value: stats.posts, 
      icon: '✍️', 
      bgColor: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
      textColor: '#1e40af',
      hoverColor: '#3b82f6',
      link: '/posts' 
    },
    { 
      label: 'Materials', 
      value: stats.materials, 
      icon: '📖', 
      bgColor: 'linear-gradient(135deg, #f3e8ff 0%, #ddd6fe 100%)', 
      textColor: '#6b21a8',
      hoverColor: '#8b5cf6',
      link: '/materials' 
    },
    { 
      label: 'Sessions', 
      value: stats.sessions, 
      icon: '🕒', 
      bgColor: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
      textColor: '#065f46',
      hoverColor: '#10b981',
      link: '/sessions' 
    },
    { 
      label: 'Connections', 
      value: stats.connections, 
      icon: '👥', 
      bgColor: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', 
      textColor: '#9a3412',
      hoverColor: '#f59e0b',
      link: '/psychiatrists' 
    },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'sans-serif'",
      boxSizing: 'border-box',
      padding: 0,
      margin: 0,
    }}>
      <Sidebar onLogout={handleLogout} user={user} />

      <main
        style={{
          marginLeft: '280px',
          padding: '2rem',
          width: 'calc(100% - 280px)',
          color: '#1e293b',
          overflowY: 'auto',
          background: '#f8fafc',
          boxSizing: 'border-box',
          borderTop: '1px solid #e5e7eb',
          borderRight: '1px solid #e5e7eb',
        }}
        aria-label="User Dashboard"
      >
        <header style={{ 
          marginBottom: '2rem',
          animation: 'fadeIn 0.6s ease forwards',
          padding: '0 1rem',
          boxSizing: 'border-box',
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            background: 'linear-gradient(90deg, #00dbde 0%, #fc00ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.5px'
          }}>
            {greeting}, {user?.fullName}!
          </h1>
          <p style={{ 
            fontSize: '1rem', 
            color: '#64748b',
            maxWidth: '600px'
          }}>
            Here's what's happening with your mental health journey today.
          </p>
        </header>

        {error && (
          <div role="alert" style={{ 
            padding: '1rem',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #fecaca',
            boxSizing: 'border-box',
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '0 1rem',
            boxSizing: 'border-box',
          }}
          aria-label="Summary cards"
        >
          {summaryCards.map((card, idx) => (
            <Link
              key={card.label}
              to={card.link}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: card.bgColor,
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                color: card.textColor,
                textDecoration: 'none',
                fontWeight: '700',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '140px',
                border: `1px solid ${hoveredCard === idx ? card.hoverColor : '#e5e7eb'}`,
                transform: hoveredCard === idx ? 'translateY(-5px)' : 'none',
                boxSizing: 'border-box',
              }}
              aria-label={`Navigate to ${card.label}`}
            >
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontSize: '2rem',
                  opacity: 0.8
                }}>
                  {card.icon}
                </span>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.7)',
                  color: card.textColor
                }}>
                  View
                </div>
              </div>
              <div>
                <div style={{ 
                  fontSize: '1rem', 
                  marginBottom: '0.3rem',
                  fontWeight: '600'
                }}>
                  {card.label}
                </div>
                <div style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '800',
                  lineHeight: '1'
                }}>
                  {card.value}
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Recent Posts and Materials */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '2rem',
            padding: '0 1rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Recent Posts */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              minHeight: '300px',
              overflowY: 'auto',
              maxHeight: '300px',
              border: '1px solid #bfdbfe',
              boxSizing: 'border-box',
            }}
            aria-label="Recent posts"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2 style={{ 
                fontWeight: '700', 
                fontSize: '1.2rem', 
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '6px',
                  height: '18px',
                  background: '#3b82f6',
                  borderRadius: '3px'
                }}></span>
                Recent Posts
              </h2>
              <Link
                to="/posts"
                style={{
                  fontSize: '0.8rem',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                View All <span>→</span>
              </Link>
            </div>

            {recentPosts.length === 0 ? (
              <div style={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✍️</span>
                <p>No recent posts yet</p>
                <p style={{ fontSize: '0.8rem' }}>Share your thoughts with the community</p>
              </div>
            ) : (
              recentPosts.map((post) => (
                <article
                  key={post._id}
                  style={{
                    borderBottom: '1px solid #dbeafe',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <p style={{ 
                    color: '#1e40af', 
                    fontWeight: '500',
                    lineHeight: '1.4',
                    marginBottom: '0.3rem',
                    fontSize: '0.9rem'
                  }}>
                    {post.content.length > 80 ? post.content.slice(0, 80) + '...' : post.content}
                  </p>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.7rem',
                    color: '#60a5fa'
                  }}>
                    <span>Posted by: {post.user.fullName}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Recent Materials */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              minHeight: '300px',
              overflowY: 'auto',
              maxHeight: '300px',
              border: '1px solid #ddd6fe',
              boxSizing: 'border-box',
            }}
            aria-label="Recent materials"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2 style={{ 
                fontWeight: '700', 
                fontSize: '1.2rem', 
                color: '#6b21a8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '6px',
                  height: '18px',
                  background: '#8b5cf6',
                  borderRadius: '3px'
                }}></span>
                Recent Materials
              </h2>
              <Link
                to="/materials"
                style={{
                  fontSize: '0.8rem',
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                View All <span>→</span>
              </Link>
            </div>

            {recentMaterials.length === 0 ? (
              <div style={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a78bfa',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</span>
                <p>No materials added yet</p>
                <p style={{ fontSize: '0.8rem' }}>Explore our resource library</p>
              </div>
            ) : (
              recentMaterials.map((material) => (
                <article
                  key={material._id}
                  style={{
                    borderBottom: '1px solid #e9d5ff',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <h3 style={{ 
                    color: '#6b21a8', 
                    fontWeight: '600',
                    marginBottom: '0.3rem',
                    fontSize: '0.9rem'
                  }}>
                    {material.title.length > 50 ? material.title.slice(0, 50) + '...' : material.title}
                  </h3>
                  <div style={{ 
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.7rem',
                    color: '#a78bfa',
                    marginBottom: '0.3rem'
                  }}>
                    <span style={{
                      background: '#f3e8ff',
                      color: '#6b21a8',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }}>
                      {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '0.7rem',
                    color: '#a78bfa'
                  }}>
                    Added by: {material.user.fullName}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Daily Motivation Section */}
        <section style={{
          background: 'linear-gradient(135deg, #00dbde 0%, #fc00ff 100%)',
          borderRadius: '12px',
          padding: '2rem',
          color: 'white',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb',
          boxSizing: 'border-box',
        }}>
          <h2 style={{ 
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Daily Motivation
          </h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.5',
            maxWidth: '800px',
            marginBottom: '1.5rem'
          }}>
            {dailyMotivation}
          </p>
          <button style={{
            background: 'white',
            color: '#7c3aed',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowRedirectPopup(true)}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
            Read More Inspirations
          </button>
        </section>

        {/* Redirect Confirmation Popup */}
        {showRedirectPopup && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e6f2 100%)',
                borderRadius: '12px',
                padding: '2rem',
                width: '400px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                animation: 'fadeInUp 0.3s ease-out',
                border: '1px solid #b3c5d3',
                color: '#1e293b',
                boxSizing: 'border-box',
              }}
            >
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                External Link Warning
              </h3>
              <p style={{ 
                fontSize: '1rem',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                You are being redirected to an external site. You will be logged out of the application. Proceed?
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowRedirectPopup(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#94a3b8',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#64748b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#94a3b8';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRedirect}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          html, body {
            margin: 0;
            padding: 0;
            height: '100%',
            box-sizing: border-box;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;