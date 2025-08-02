import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Utils
import { getCurrentUser, initializeDefaultData } from './utils/auth';

// Components
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AppProvider } from './context/AppContext';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Rooms = lazy(() => import('./pages/Rooms'));
const Tenants = lazy(() => import('./pages/Tenants'));
const Contracts = lazy(() => import('./pages/Contracts'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Incidents = lazy(() => import('./pages/Incidents'));
const CostManagement = lazy(() => import('./pages/CostManagement'));
const Accounts = lazy(() => import('./pages/Accounts'));
const Feedback = lazy(() => import('./pages/Feedback'));
const SystemManagement = lazy(() => import('./pages/SystemManagement'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Khởi tạo dữ liệu mặc định
    initializeDefaultData();
    
    // Kiểm tra user đã đăng nhập
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/expenses" element={<CostManagement />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/system" element={<SystemManagement />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
