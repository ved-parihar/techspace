import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import type { Page, IconName } from '../types';

const navItems: { label: Page; path: string; icon: IconName }[] = [
  { label: 'Overview', path: '/overview', icon: 'grid' },
  { label: 'Transactions', path: '/transactions', icon: 'swap' },
  { label: 'Budgets', path: '/budgets', icon: 'wallet' },
  { label: 'Analytics', path: '/analytics', icon: 'chart' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => navigate('/overview')}>
        <span className="brand-mark">
          <Icon name="chart" />
        </span>
        <span>
          Wellspend<span className="brand-dot">.</span>
        </span>
      </button>

      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
          return (
            <button
              key={item.label}
              className={isActive ? 'nav-item active' : 'nav-item'}
              onClick={() => navigate(item.path)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-card">
        <div className="sidebar-card-icon">
          <Icon name="bolt" />
        </div>
        <strong>Smart insights</strong>
        <p>You spent 18% less on dining this month.</p>
        <button onClick={() => navigate('/analytics')}>View insights</button>
      </div>

      <div className="profile" style={{ cursor: 'pointer' }} onClick={logout} title="Click to log out">
        <div className="avatar">{getInitials(user?.name)}</div>
        <div>
          <strong>{user?.name || 'Alex Morgan'}</strong>
          <span>{user?.email || 'alex@example.com'}</span>
        </div>
        <Icon name="dots" />
      </div>
    </aside>
  );
}
