import { Navigate } from 'react-router-dom';
export default function ProtectedRoute({ children, rolesAllowed }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || (rolesAllowed && !rolesAllowed.includes(role))) {
    return <Navigate to="/login" />;
  }
  return children;
}