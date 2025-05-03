import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    issueType: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);

  const { name, contactNumber, email, issueType, description } = formData;

  useEffect(() => {
    let timer;
    if (submitSuccess) {
      timer = setTimeout(() => {
        onCancel();
      }, 5000); // Auto-close after 5 seconds
    }
    return () => clearTimeout(timer);
  }, [submitSuccess]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("https://formspree.io/f/mqaerqlg", {
        method: "POST",
        body: JSON.stringify({
          to: "mindcarehubadmin@gmail.com",
          subject: `MindCare Hub Contact: ${issueType || 'General Issue'} from ${name}`,
          message: `Name: ${name}\nContact Number: ${contactNumber}\nEmail: ${email}\nIssue Type: ${issueType || 'Not Specified'}\nDescription: ${description}`
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    setFormData({ name: '', contactNumber: '', email: '', issueType: '', description: '' });
    setSubmitSuccess(false);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
    
    :root {
      --primary: #6C63FF;
      --primary-light: #8A85FF;
      --secondary: #FF6584;
      --dark: #2D3748;
      --light: #F7FAFC;
      --gray: #A0AEC0;
      --success: #48BB78;
      --success-light: #81E6D9;
      --bg-gradient: linear-gradient(135deg, #f0f4ff 0%, #d9e2ff 100%);
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Montserrat', sans-serif;
      background: var(--bg-gradient);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .contact-wrapper {
      width: 100%;
      max-width: 900px;
      position: relative;
    }
    
    .contact-container {
      width: 100%;
      height: 600px;
      background: white;
      border-radius: 25px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      display: grid;
      grid-template-columns: 1fr 1fr;
      overflow: hidden;
      position: relative;
    }
    
    .visual-side {
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
      color: white;
    }
    
    .visual-side::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
      animation: rotate 20s linear infinite;
    }
    
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .visual-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .visual-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    
    .visual-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .visual-subtitle {
      font-size: 1rem;
      opacity: 0.9;
      margin-bottom: 20px;
    }
    
    .dashboard-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 12px 25px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      z-index: 1000;
    }
    
    .dashboard-btn:hover {
      background: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(108, 99, 255, 0.3);
    }
    
    .form-side {
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .form-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 30px;
      position: relative;
    }
    
    .form-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 50px;
      height: 3px;
      background: var(--primary);
      border-radius: 3px;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .form-group {
      position: relative;
      margin-bottom: 15px;
    }
    
    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 5px;
      color: var(--dark);
      transition: all 0.3s ease;
    }
    
    .form-group.active .form-label {
      color: var(--primary);
      transform: translateY(-5px);
    }
    
    .form-group.hovered .form-label {
      color: var(--primary-light);
    }
    
    .form-input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #EDF2F7;
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background-color: #F8FAFC;
    }
    
    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
      background-color: white;
    }
    
    .form-group.active .form-input {
      border-color: var(--primary);
      background-color: white;
    }
    
    .form-group.hovered .form-input {
      border-color: var(--primary-light);
    }
    
    .form-select {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #EDF2F7;
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background-color: #F8FAFC;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%232D3748' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 15px center;
      background-size: 12px;
    }
    
    .form-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
      background-color: white;
    }
    
    .form-textarea {
      grid-column: span 2;
      width: 100%;
      padding: 15px;
      border: 2px solid #EDF2F7;
      border-radius: 10px;
      font-size: 0.95rem;
      min-height: 100px;
      resize: none;
      transition: all 0.3s ease;
      background-color: #F8FAFC;
    }
    
    .form-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
      background-color: white;
    }
    
    .button-group {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }
    
    .send-btn {
      flex: 1;
      padding: 15px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--primary);
      color: white;
    }
    
    .send-btn:hover {
      background: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(108, 99, 255, 0.3);
    }
    
    /* Enhanced Success Message Styles */
    .success-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }
    
    .success-card {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 450px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
    }
    
    .success-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 8px;
      background: linear-gradient(to right, var(--primary), var(--success));
    }
    
    .success-icon-container {
      width: 100px;
      height: 100px;
      margin: 0 auto 25px;
      position: relative;
    }
    
    .success-icon-circle {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--success-light), var(--success));
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
      70% { box-shadow: 0 0 0 15px rgba(72, 187, 120, 0); }
      100% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
    }
    
    .success-icon {
      font-size: 3.5rem;
      color: white;
    }
    
    .success-message {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 15px;
      color: var(--dark);
      background: linear-gradient(to right, var(--primary), var(--success));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .success-submessage {
      font-size: 1rem;
      color: var(--gray);
      margin-bottom: 25px;
      line-height: 1.6;
    }
    
    .success-details {
      background: #F8FAFC;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 25px;
      text-align: left;
    }
    
    .success-detail {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }
    
    .success-detail:last-child {
      margin-bottom: 0;
    }
    
    .success-detail i {
      color: var(--success);
      margin-right: 10px;
      width: 20px;
      text-align: center;
    }
    
    .success-btn {
      padding: 12px 30px;
      background: linear-gradient(to right, var(--primary), var(--success));
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 5px 15px rgba(108, 99, 255, 0.3);
    }
    
    .success-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(108, 99, 255, 0.4);
    }
    
    @media (max-width: 768px) {
      .contact-container {
        grid-template-columns: 1fr;
        height: auto;
        max-height: 100vh;
        overflow-y: auto;
      }
      
      .visual-side {
        display: none;
      }
      
      .form-side {
        padding: 30px;
      }
      
      .dashboard-btn {
        position: static;
        margin-bottom: 20px;
        align-self: flex-start;
      }
      
      .success-card {
        width: 90%;
        padding: 30px 20px;
      }
      
      .success-icon-container {
        width: 80px;
        height: 80px;
      }
      
      .success-message {
        font-size: 1.5rem;
      }
    }
  `;

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      />
      <Link to="/dashboard" className="dashboard-btn">
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </Link>
      <div className="contact-wrapper">
        <div className="contact-container">
          <AnimatePresence>
            {submitSuccess ? (
              <motion.div 
                className="success-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="success-card"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="success-icon-container">
                    <div className="success-icon-circle">
                      <i className="fas fa-check success-icon"></i>
                    </div>
                  </div>
                  <h2 className="success-message">Message Received!</h2>
                  <p className="success-submessage">
                    Thank you for reaching out. We've received your message and will respond soon.
                    <br />(This will close automatically in 5 seconds)
                  </p>
                  
                  <div className="success-details">
                    <div className="success-detail">
                      <i className="fas fa-user"></i>
                      <span><strong>Name:</strong> {name}</span>
                    </div>
                    <div className="success-detail">
                      <i className="fas fa-envelope"></i>
                      <span><strong>Email:</strong> {email}</span>
                    </div>
                    {contactNumber && (
                      <div className="success-detail">
                        <i className="fas fa-phone"></i>
                        <span><strong>Phone:</strong> {contactNumber}</span>
                      </div>
                    )}
                    <div className="success-detail">
                      <i className="fas fa-question-circle"></i>
                      <span><strong>Issue:</strong> {issueType || 'General Inquiry'}</span>
                    </div>
                  </div>

                  <button 
                    className="success-btn"
                    onClick={onCancel}
                  >
                    <i className="fas fa-paper-plane"></i> Send Another Message
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <>
                <div className="visual-side">
                  <div className="visual-content">
                    <h2 className="visual-title">Mental Health Tracker Portal</h2>
                    <i className="fas fa-headset visual-icon"></i>
                    <p className="visual-subtitle">
                      Our team is here to assist with any questions about our mental health tracking features or platform.
                    </p>
                  </div>
                </div>
                
                <div className="form-side">
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h2 className="form-title">Contact Us</h2>
                    <form onSubmit={onSubmit}>
                      <div className="form-grid">
                        <div 
                          className={['form-group', activeField === 'name' ? 'active' : '', hoveredField === 'name' ? 'hovered' : ''].join(' ')}
                          onFocus={() => setActiveField('name')}
                          onBlur={() => setActiveField(null)}
                          onMouseEnter={() => setHoveredField('name')}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            className="form-input"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        
                        <div 
                          className={['form-group', activeField === 'contactNumber' ? 'active' : '', hoveredField === 'contactNumber' ? 'hovered' : ''].join(' ')}
                          onFocus={() => setActiveField('contactNumber')}
                          onBlur={() => setActiveField(null)}
                          onMouseEnter={() => setHoveredField('contactNumber')}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          <label className="form-label">Contact Number</label>
                          <input
                            type="tel"
                            name="contactNumber"
                            value={contactNumber}
                            onChange={onChange}
                            className="form-input"
                            placeholder="+1 (123) 456-7890"
                            required
                          />
                        </div>
                        
                        <div 
                          className={['form-group', activeField === 'email' ? 'active' : '', hoveredField === 'email' ? 'hovered' : ''].join(' ')}
                          onFocus={() => setActiveField('email')}
                          onBlur={() => setActiveField(null)}
                          onMouseEnter={() => setHoveredField('email')}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="form-input"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        
                        <div 
                          className={['form-group', activeField === 'issueType' ? 'active' : '', hoveredField === 'issueType' ? 'hovered' : ''].join(' ')}
                          onFocus={() => setActiveField('issueType')}
                          onBlur={() => setActiveField(null)}
                          onMouseEnter={() => setHoveredField('issueType')}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          <label className="form-label">Issue Type</label>
                          <select
                            name="issueType"
                            value={issueType}
                            onChange={onChange}
                            className="form-select"
                            required
                          >
                            <option value="">Select an option</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Account Issue">Account Issue</option>
                            <option value="Content Feedback">Content Feedback</option>
                            <option value="General Inquiry">General Inquiry</option>
                          </select>
                        </div>
                        
                        <div 
                          className={['form-group', activeField === 'description' ? 'active' : '', hoveredField === 'description' ? 'hovered' : ''].join(' ')}
                          onFocus={() => setActiveField('description')}
                          onBlur={() => setActiveField(null)}
                          onMouseEnter={() => setHoveredField('description')}
                          onMouseLeave={() => setHoveredField(null)}
                          style={{ gridColumn: 'span 2' }}
                        >
                          <label className="form-label">Description</label>
                          <textarea
                            name="description"
                            value={description}
                            onChange={onChange}
                            className="form-textarea"
                            placeholder="Tell us about your issue..."
                            required
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="button-group">
                        <button
                          type="submit"
                          className="send-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i> Sending...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane"></i> Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ContactUs;