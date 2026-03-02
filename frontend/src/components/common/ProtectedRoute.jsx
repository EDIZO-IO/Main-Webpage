import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Wrapper for routes that require authentication
 * 
 * Usage:
 * <Route path="/apply/:id" element={
 *   <ProtectedRoute>
 *     <InternshipApplication />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login with return URL
    const currentPath = window.location.pathname;
    return <Navigate to={`${redirectTo}?returnUrl=${encodeURIComponent(currentPath)}`} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
