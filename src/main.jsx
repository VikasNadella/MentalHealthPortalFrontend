import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';
import PostManagement from './components/PostManagement.jsx';
import MaterialManagement from './components/MaterialManagement.jsx';
import PsychiatristManagement from './components/PsychiatristManagement.jsx';
import SupportSessionManagement from './components/SupportSessionManagement.jsx';
import ContactUs from './components/ContactUs.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/verify/:token" element={<VerifyEmail />} />
      <Route path="/posts" element={<PostManagement />} />
      <Route path="/materials" element={<MaterialManagement />} />
      <Route path="/psychiatrists" element={<PsychiatristManagement />} />
      <Route path="/sessions" element={<SupportSessionManagement />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
);