import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  let userData = JSON.parse(localStorage.getItem('userData'))
  const token = userData ? userData.token : null;
  const userRole = userData ? userData.user.role : null;
  if (!token || token === null) {
    console.log(token)
    return <Navigate to="/login" replace />;
  }
  if (role && userRole !== role) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;