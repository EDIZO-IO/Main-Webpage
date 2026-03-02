import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CertificatesManager from './pages/CertificatesManager';
import InternshipsManager from './pages/InternshipsManager';
import ServicesManager from './pages/ServicesManager';
import EventsManager from './pages/EventsManager';
import TestimonialsManager from './pages/TestimonialsManager';
import ProjectsManager from './pages/ProjectsManager';
import TeamManager from './pages/TeamManager';
import UsersManager from './pages/UsersManager';
import AdminUsersManager from './pages/AdminUsersManager';
import ContactSubmissionsManager from './pages/ContactSubmissionsManager';
import InternshipApplicationsManager from './pages/InternshipApplicationsManager';
import ServiceApplicationsManager from './pages/ServiceApplicationsManager';
import Layout from './components/Layout';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('admin_token');
    if (auth) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
          />
          
          {/* Protected Admin Routes */}
          {isAuthenticated ? (
            <Route path="/" element={<Layout onLogout={handleLogout} />}>
              <Route index element={<Dashboard />} />
              <Route path="certificates" element={<CertificatesManager />} />
              <Route path="internships" element={<InternshipsManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="team" element={<TeamManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="admin-users" element={<AdminUsersManager />} />
              <Route path="contact" element={<ContactSubmissionsManager />} />
              <Route path="events" element={<EventsManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="applications" element={<ServiceApplicationsManager />} />
              <Route path="internship-applications" element={<InternshipApplicationsManager />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          ) : (
            <Route path="/*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
