import { useState, useEffect } from 'react';
import axios from 'axios';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [comment, setComment] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

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
        { recommendation },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts(posts.map(post => post._id === postId ? response.data : post));
      setRecommendation('');
      setError('');
    } catch (err) {
      setError('Failed to add recommendation');
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
    post: {
      border: '1px solid #ccc',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '4px',
    },
    comment: {
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
      <h2>Post Management</h2>
      {error && <p style={styled.error}>{error}</p>}
      <form style={styled.form} onSubmit={handlePostSubmit}>
        <textarea
          style={styled.input}
          placeholder="Write a post..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          required
        />
        <button style={styled.button} type="submit">Post</button>
      </form>
      {posts.map(post => (
        <div key={post._id} style={styled.post}>
          <p><strong>{post.user.fullName}</strong>: {post.content}</p>
          {post.recommendation && <p><strong>Recommendation:</strong> {post.recommendation}</p>}
          <div>
            <textarea
              style={styled.input}
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              style={styled.button}
              onClick={() => handleCommentSubmit(post._id)}
            >
              Comment
            </button>
          </div>
          {post.comments.map((cmt, index) => (
            <p key={index} style={styled.comment}>
              <strong>{cmt.user.fullName}</strong>: {cmt.content}
            </p>
          ))}
          {localStorage.getItem('token') && JSON.parse(atob(localStorage.getItem('token').split('.')[1])).isPsychiatrist && (
            <div>
              <textarea
                style={styled.input}
                placeholder="Add a recommendation..."
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
              />
              <button
                style={styled.button}
                onClick={() => handleRecommendationSubmit(post._id)}
              >
                Add Recommendation
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostManagement;