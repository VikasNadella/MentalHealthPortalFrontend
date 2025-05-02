import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  const styled = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
      zIndex: 1,
      textAlign: 'center',
      overflow: 'hidden',
    },
    background: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/homePage.avif")',
      backgroundSize: 'cover',
      backgroundPosition: 'center left',
      zIndex: -1,
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(10,25,47,0.8) 100%)',
      zIndex: 0,
    },
    heading: {
      fontSize: '3.5rem',
      fontWeight: '900',
      marginBottom: '1rem',
      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
      letterSpacing: '3px',
      color: '#64ffda',
    },
    subheading: {
      fontSize: '1.5rem',
      maxWidth: '700px',
      marginBottom: '3rem',
      lineHeight: 1.6,
      color: 'rgba(255,255,255,0.9)',
      textShadow: '0 1px 6px rgba(0,0,0,0.7)',
    },
    contentWrapper: {
      display: 'flex',
      width: '100%',
      maxWidth: '1400px',
      gap: '3rem',
      alignItems: 'center',
      flexDirection: 'row-reverse',
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      textAlign: 'right',
      padding: '2rem',
    },
    featuresGrid: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1.5rem',
      padding: '1rem',
    },
    card: {
      borderRadius: '20px',
      padding: '2rem',
      color: '#fff',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(10,25,47,0.6)',
      border: '1px solid rgba(100,255,218,0.2)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      transition: 'all 0.3s ease',
      cursor: 'default',
      minHeight: '180px',
      userSelect: 'none',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      backgroundColor: 'rgba(10,25,47,0.8)',
      boxShadow: '0 12px 40px rgba(100,255,218,0.2)',
      border: '1px solid rgba(100,255,218,0.4)',
    },
    cardIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '0.75rem',
      color: '#64ffda',
      textShadow: '0 1px 4px rgba(0,0,0,0.6)',
    },
    cardText: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: 'rgba(255,255,255,0.9)',
      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
    },
    buttonsContainer: {
      display: 'flex',
      gap: '1.5rem',
      marginTop: '2rem',
    },
    button: {
      padding: '1rem 2.5rem',
      backgroundColor: 'rgba(10,25,47,0.8)',
      color: '#64ffda',
      fontWeight: '700',
      borderRadius: '50px',
      textDecoration: 'none',
      fontSize: '1.1rem',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      userSelect: 'none',
      cursor: 'pointer',
      letterSpacing: '0.05em',
      border: '1px solid #64ffda',
    },
    buttonHover: {
      backgroundColor: 'rgba(100,255,218,0.2)',
      boxShadow: '0 12px 35px rgba(100,255,218,0.3)',
      color: '#fff',
    },
  };

  const features = [
    {
      icon: '💬', // Changed from 🧠 to speech bubbles
      title: 'Share Your Story',
      text: 'Openly share your experiences and challenges in a safe, supportive community.',
    },
    {
      icon: '📖', // Changed from 🎵📚 to single book icon
      title: 'Curated Resources',
      text: 'Access uplifting music and insightful reading materials reviewed by experts.',
    },
    {
      icon: '👨‍⚕️', // Changed to single doctor icon
      title: 'Professional Help',
      text: 'Find qualified psychiatrists for personalized advice and treatment.',
    },
    {
      icon: '👥', // Changed from 🤝 to group of people
      title: 'Support Sessions',
      text: 'Join live support sessions designed to foster healing and connection.',
    },
  ];

  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [hoveredButton, setHoveredButton] = React.useState(null);

  return (
    <>
      <div style={styled.background} aria-hidden="true" />
      <div style={styled.overlay} aria-hidden="true" />
      <main style={styled.container} role="main" aria-label="Mental Health Support Home Page">
        <div style={styled.contentWrapper}>
          <div style={styled.rightPanel}>
            <h1 style={styled.heading}>Mental Health Support</h1>
            <p style={styled.subheading}>
              Connect, share, and find support for your mental health journey. 
              Together, we heal and grow stronger.
            </p>
            
            <nav style={styled.buttonsContainer} aria-label="Authentication options">
              <Link
                to="/login"
                style={{
                  ...styled.button,
                  ...(hoveredButton === 'login' ? styled.buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton('login')}
                onMouseLeave={() => setHoveredButton(null)}
                aria-label="Login to your account"
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  ...styled.button,
                  ...(hoveredButton === 'register' ? styled.buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton('register')}
                onMouseLeave={() => setHoveredButton(null)}
                aria-label="Register a new account"
              >
                Register
              </Link>
            </nav>
          </div>

          <section style={styled.featuresGrid} aria-label="Portal Features">
            {features.map(({ icon, title, text }, i) => (
              <article
                key={i}
                tabIndex={0}
                aria-labelledby={`feature-title-${i}`}
                aria-describedby={`feature-desc-${i}`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  ...styled.card,
                  ...(hoveredCard === i ? styled.cardHover : {}),
                }}
              >
                <div style={styled.cardIcon} aria-hidden="true">{icon}</div>
                <h3 id={`feature-title-${i}`} style={styled.cardTitle}>{title}</h3>
                <p id={`feature-desc-${i}`} style={styled.cardText}>{text}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

export default App;