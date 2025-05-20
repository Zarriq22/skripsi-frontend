import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";
import NotFound from "./components/ui/NotFound";
import DetailProduk from "./pages/componentProduk/produk/detail";
import CreateNewPassword from "./pages/resetPassword";
import Keranjang from "./pages/componentProduk/keranjang/keranjang";
import ProductFavorite from "./pages/componentProduk/wishlist";
import { Component } from "react";
import MainLayout from "./components/layout/mainLayout";
import Home from "./pages/home";
import CustomerService from "./pages/customerService";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("role"),
    };
  }

  render() {
    return (
      <div className="app-e-commerce">
        <Router>
          <MainLayout>
            <Routes>
              {/* Route Home */}
              <Route path="/" element={<Home />} />

              {/* Route Login */}
              <Route path="/login" element={<Login />} />
    
              {/* Route Register */}
              <Route path="/register" element={<Register />} />
    
              {/* Route Create New Password */}
              <Route path="/reset-password" element={<CreateNewPassword />} />
    
              {/* Route Not Found */}
              <Route path="/unauthorized" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
    
              {/* Route Dashboard */}
              <Route path="/admin-dashboard" element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/user-dashboard" element={
                  <ProtectedRoute role="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
    
              <Route path="/detail-product/:id" element={
                  <ProtectedRoute role="user">
                    <DetailProduk />
                  </ProtectedRoute>
                }
              />
    
              <Route path="/keranjang/:userId" element={
                  <ProtectedRoute role="user">
                    <Keranjang />
                  </ProtectedRoute>
                }
              />
    
              <Route path="/product-favorite/:userId" element={
                  <ProtectedRoute role="user">
                    <ProductFavorite />
                  </ProtectedRoute>
                }
              />

              <Route path="/checkout" element={
                  <ProtectedRoute role="user">
                    <Keranjang />
                  </ProtectedRoute>
                }
              />

              <Route path="/customer-service/:userId" element={
                  <ProtectedRoute role="user">
                    <CustomerService />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
        </Router>
      </div>
    );
  }
}
// function App() {
  
// }

export default App;