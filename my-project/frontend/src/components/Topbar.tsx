import React from 'react';
import Icon from './Icon';

interface TopbarProps {
  title: string;
  query?: string;
  onQueryChange?: (query: string) => void;
  onAddTransaction?: () => void;
}

export default function Topbar({
  title,
  query = '',
  onQueryChange,
  onAddTransaction,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">PERSONAL FINANCE</p>
        <h1>{title}</h1>
      </div>
      <div className="top-actions">
        {onQueryChange && (
          <label className="search">
            <Icon name="search" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search transactions"
            />
          </label>
        )}
        <button className="icon-button" aria-label="Notifications" type="button">
          <Icon name="bell" />
          <span className="notification-dot" />
        </button>
        {onAddTransaction && (
          <button className="primary-button" type="button" onClick={onAddTransaction}>
            <Icon name="plus" />
            Add transaction
          </button>
        )}
      </div>
    </header>
  );
}
