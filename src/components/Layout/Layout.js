import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PerformanceMonitor from '../common/PerformanceMonitor';

const Layout = ({ children, currentUser, onLogout }) => {
  return (
    <div className="layout">
      <Sidebar currentUser={currentUser} />
      <div className="main-content">
        <Header currentUser={currentUser} onLogout={onLogout} />
        <main className="content">
          {children}
        </main>
        <PerformanceMonitor />
      </div>
    </div>
  );
};

export default Layout;