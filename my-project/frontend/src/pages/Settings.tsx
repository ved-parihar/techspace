import React from 'react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();

  const settingsItems = [
    ['Profile information', user ? `${user.name} (${user.email})` : 'Update your name and contact details'],
    ['Notifications', 'Choose what you want to hear about'],
    ['Currency & region', 'USD · United States'],
    ['Security', 'Password and account protection'],
  ];

  return (
    <>
      <Topbar title="Settings" />

      <div className="page-content">
        <section className="panel settings-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">PREFERENCES</p>
              <h2>Account settings</h2>
            </div>
          </div>
          {settingsItems.map((item, i) => (
            <button className="settings-row" key={item[0]} type="button">
              <span className="settings-number">0{i + 1}</span>
              <span>
                <strong>{item[0]}</strong>
                <small>{item[1]}</small>
              </span>
              <b>→</b>
            </button>
          ))}
          <div style={{ padding: '24px 0 0 0' }}>
            <button
              className="secondary-button"
              onClick={logout}
              type="button"
              style={{ color: '#ef4444', borderColor: '#fca5a5' }}
            >
              Log out of Wellspend
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
