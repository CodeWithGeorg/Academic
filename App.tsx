
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import PlaceOrder from './pages/PlaceOrder';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import { UserRole } from './constants';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Wrap all routes in the MainLayout */}
          <Route element={<MainLayout />}>
            
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Client & Admin Shared Routes */}
            <Route element={<PrivateRoute allowedRoles={[UserRole.CLIENT, UserRole.ADMIN]} />}>
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/place-order" element={<PlaceOrder />} />
            </Route>
            
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;