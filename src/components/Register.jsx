import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const RegisterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: flex-end;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-image: url("/register_image.avif");
  background-size: cover;
  background-position: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
`;

const RightPanel = styled.div`
  width: 40%;
  min-width: 400px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(8px);
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 2.5rem;
  background-color: rgba(40, 50, 70, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  color: white;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Heading = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Subheading = styled.p`
  font-size: 0.95rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-in-out 0.1s;
  animation-fill-mode: both;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  animation: ${fadeIn} 0.5s ease-in-out 0.2s;
  animation-fill-mode: both;
`;

const Input = styled.input`
  padding: 0.9rem 1.2rem;
  background-color: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255,255,255,0.7);
  }

  &:focus {
    border-color: rgba(255,255,255,0.4);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  cursor: pointer;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.9);
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: rgba(255,255,255,0.7);
`;

const SubmitButton = styled.button`
  padding: 0.9rem;
  margin-top: 0.5rem;
  background-color: rgba(255,255,255,0.2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-in-out 0.3s;
  animation-fill-mode: both;

  &:hover {
    background-color: rgba(255,255,255,0.3);
    animation: ${pulse} 2s infinite;
  }
`;

const Footer = styled.div`
  margin-top: 1.8rem;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  animation: ${fadeIn} 0.5s ease-in-out 0.4s;
  animation-fill-mode: both;
`;

const LoginLink = styled(Link)`
  color: white;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.3rem;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    isPsychiatrist: false,
    specialization: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <RegisterContainer>
      <Overlay />
      <RightPanel>
        <RegisterCard>
          <Heading>Create Account</Heading>
          <Subheading>Join our community today</Subheading>
          
          <RegisterForm onSubmit={handleSubmit}>
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                name="isPsychiatrist"
                checked={formData.isPsychiatrist}
                onChange={handleChange}
              />
              Register as Psychiatrist
            </CheckboxLabel>
            
            {formData.isPsychiatrist && (
              <>
                <Input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="contact"
                  placeholder="Contact Information"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            
            <SubmitButton
              type="submit"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              Register
            </SubmitButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </RegisterForm>

          <Footer>
            Already have an account? <LoginLink to="/login">Sign in</LoginLink>
          </Footer>
        </RegisterCard>
      </RightPanel>
    </RegisterContainer>
  );
};

export default Register;