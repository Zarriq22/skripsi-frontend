import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  let userData = JSON.parse(localStorage.getItem('userData'))
  const token = userData.token;
  const userRole = userData.user.role;
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (role && userRole !== role) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;