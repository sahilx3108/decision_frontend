import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import { DecisionProvider, DecisionContext } from './context/DecisionContext';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(DecisionContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Route that redirects to dashboard if already logged in
const AuthRoute = ({ children }) => {
  const { token } = useContext(DecisionContext);
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Main App Router Component to consume context
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div className="antialiased min-h-screen bg-background text-text">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />

          {/* Auth Routes */}
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/register" element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } />

          {/* Protected Routes Wrapper (Dashboard Layout) */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <DecisionProvider>
      <AppRoutes />
    </DecisionProvider>
  );
}

export default App;
