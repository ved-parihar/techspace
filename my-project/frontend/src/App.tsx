import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Overview from './pages/Overview';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import OAuthCallback from './pages/OAuthCallback';

function AppShell() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          fontSize: '18px',
          fontWeight: 600,
          color: '#30222f',
          background: '#f7f1e9',
        }}
      >
        Loading Wellspend...
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
