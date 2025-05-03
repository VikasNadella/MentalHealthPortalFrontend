import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [comment, setComment] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');
  const [hoveredPost, setHoveredPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
      }
    };
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/api/posts',
        { content: newPost },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts([response.data, ...posts]);
      setNewPost('');
      setError('');
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/${postId}/comment`,
        { content: comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts(posts.map(post => post._id === postId ? response.data : post));
      setComment('');
      setError('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleRecommendationSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/${postId}/recommendation`,
        { content: recommendation },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts(posts.map(post => post._id === postId ? response.data : post));
      setRecommendation('');
      setError('');
    } catch (err) {
      setError('Failed to add recommendation');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1a1a2e 0%, #0f0f1a 100%)',
      padding: '2rem',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'sans-serif'",
      boxSizing: 'border-box',
      margin: 0,
      overflowY: 'auto',
      position: 'relative',
      color: '#e0e0e0',
    }}>
      {/* Starry Background Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '5px 5px',
        opacity: 0.3,
        zIndex: 0,
      }} />

      {/* Back to Dashboard Button */}
      <Link to="/dashboard" style={{
        display: 'inline-block',
        padding: '0.7rem 1.5rem',
        background: 'linear-gradient(90deg, #4b5bd7 0%, #a855f7 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '1rem',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 15px rgba(75, 91, 215, 0.5)',
        position: 'relative',
        zIndex: 1,
        marginBottom: '2rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 0 25px rgba(75, 91, 215, 0.8)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 0 15px rgba(75, 91, 215, 0.5)';
      }}>
        Back to Dashboard
      </Link>

      <header style={{
        textAlign: 'center',
        marginBottom: '2rem',
        animation: 'glow 2s ease-in-out infinite alternate',
        position: 'relative',
        zIndex: 1,
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#fff',
          textShadow: '0 0 10px rgba(147, 51, 234, 0.8), 0 0 20px rgba(147, 51, 234, 0.5)',
          letterSpacing: '1px',
        }}>
          Share Your Thoughts
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#a1a1aa',
          maxWidth: '600px',
          margin: '0.5rem auto',
          fontWeight: '300',
        }}>
          Open your heart and connect with the community under the stars.
        </p>
      </header>

      {error && (
        <div role="alert" style={{
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.2)',
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

      <form onSubmit={handlePostSubmit} style={{
        maxWidth: '500px',
        margin: '0 auto 2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        padding: '1.5rem',
        boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
        border: '1px solid rgba(147, 51, 234, 0.4)',
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1,
      }}>
        <textarea
          style={{
            width: '100%',
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid rgba(147, 51, 234, 0.5)',
            borderRadius: '10px',
            fontSize: '1rem',
            minHeight: '100px',
            resize: 'vertical',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#e0e0e0',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
          placeholder="What's on your mind? Share your thoughts..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#9333ea';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.5)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: '0.8rem 2rem',
            background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
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
            boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(147, 51, 234, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.5)';
          }}
        >
          Share Post
        </button>
      </form>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {posts.map((post, index) => (
          <div
            key={post._id}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.2)',
              border: `1px solid ${hoveredPost === index ? 'rgba(147, 51, 234, 0.8)' : 'rgba(147, 51, 234, 0.3)'}`,
              transition: 'all 0.3s ease',
              transform: hoveredPost === index ? 'scale(1.02)' : 'none',
              boxSizing: 'border-box',
              animation: `fadeInDown 0.5s ease forwards ${index * 0.2}s`,
              opacity: 0,
              backdropFilter: 'blur(10px)',
              minWidth: '800px',
            }}
            onMouseEnter={() => setHoveredPost(index)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)',
              }}>
                {post.user.fullName.charAt(0)}
              </div>
              <div>
                <p style={{
                  fontWeight: '600',
                  color: '#fff',
                  fontSize: '1.1rem',
                }}>
                  {post.user.fullName}
                </p>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#a1a1aa',
                  fontWeight: '300',
                }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p style={{
              color: '#e0e0e0',
              lineHeight: '1.7',
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '300',
            }}>
              {post.content}
            </p>
            {post.recommendation && (
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid rgba(139, 92, 246, 0.4)',
              }}>
                <p style={{
                  fontWeight: '600',
                  color: '#c4b5fd',
                  fontSize: '0.95rem',
                  marginBottom: '0.5rem',
                }}>
                  Recommendation:
                </p>
                <p style={{
                  color: '#c4b5fd',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  fontWeight: '300',
                }}>
                  {post.recommendation}
                </p>
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <textarea
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  marginBottom: '0.5rem',
                  border: '1px solid rgba(147, 51, 234, 0.5)',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  minHeight: '70px',
                  resize: 'vertical',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#e0e0e0',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                placeholder="Add a supportive comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#9333ea';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.5)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                style={{
                  padding: '0.6rem 1.5rem',
                  background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)',
                }}
                onClick={() => handleCommentSubmit(post._id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(147, 51, 234, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.5)';
                }}
              >
                Comment
              </button>
            </div>
            {post.comments.length > 0 && (
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(147, 51, 234, 0.3)',
              }}>
                {post.comments.map((cmt, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 0 10px rgba(147, 51, 234, 0.2)',
                    }}
                  >
                    <div style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      background: 'rgba(147, 51, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}>
                      {cmt.user.fullName.charAt(0)}
                    </div>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#e0e0e0',
                      lineHeight: '1.5',
                      fontWeight: '300',
                    }}>
                      <strong style={{ color: '#c4b5fd' }}>{cmt.user.fullName}</strong>: {cmt.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {localStorage.getItem('token') && JSON.parse(atob(localStorage.getItem('token').split('.')[1])).isPsychiatrist && (
              <div style={{ marginTop: '1rem' }}>
                <textarea
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    marginBottom: '0.5rem',
                    border: '1px solid rgba(147, 51, 234, 0.5)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    minHeight: '70px',
                    resize: 'vertical',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#e0e0e0',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Add a professional recommendation..."
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#9333ea';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.5)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  style={{
                    padding: '0.6rem 1.5rem',
                    background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)',
                  }}
                  onClick={() => handleRecommendationSubmit(post._id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(147, 51, 234, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.5)';
                  }}
                >
                  Add Recommendation
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            from { text-shadow: 0 0 10px rgba(147, 51, 234, 0.8), 0 0 20px rgba(147, 51, 234, 0.5); }
            to { text-shadow: 0 0 20px rgba(147, 51, 234, 1), 0 0 30px rgba(147, 51, 234, 0.8); }
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

export default PostManagement;