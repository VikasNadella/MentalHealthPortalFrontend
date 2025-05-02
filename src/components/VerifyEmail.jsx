import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users/verify/${token}`);
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };
    verifyEmail();
  }, [token, navigate]);

  const styled = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      textAlign: 'center',
    },
    message: {
      fontSize: '1.2rem',
      color: '#333',
    },
  };

  return (
    <div style={styled.container}>
      <p style={styled.message}>{message}</p>
    </div>
  );
};

export default VerifyEmail;