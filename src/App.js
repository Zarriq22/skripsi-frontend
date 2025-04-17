import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";
import NotFound from "./components/ui/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Login */}
        <Route 
          path="/" 
          element={<Login />} 
        />

        {/* Route Register */}
        <Route 
          path="/register" 
          element={<Register />} 
        />

        {/* Route Not Found */}
        <Route 
          path="/unauthorized" 
          element={<NotFound />} 
        />
        <Route 
          path="*" 
          element={<NotFound />} 
        />

        {/* Route Dashboard */}
        <Route 
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;