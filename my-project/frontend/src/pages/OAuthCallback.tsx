import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { oauthLogin } from '../services/authService';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processOAuth = async () => {
      try {
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        const params = new URLSearchParams(hash || search);

        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');

        if (!accessToken && !idToken) {
          setError('No Google authorization token was returned.');
          return;
        }

        const res = await oauthLogin({
          provider: 'google',
          credential: idToken || undefined,
          accessToken: accessToken || undefined,
        });

        login(res.token, res.user);
        navigate('/overview', { replace: true });
      } catch (err: any) {
        console.error('Google OAuth callback failed:', err);
        setError(err.response?.data?.message || 'Google authentication failed.');
      }
    };

    processOAuth();
  }, [login, navigate]);

  if (error) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          background: '#f7f1e9',
          color: '#30222f',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '420px', background: 'white', padding: '32px', borderRadius: '14px', border: '1px solid #e7ddd5' }}>
          <h2 style={{ marginTop: 0, color: '#ef4444' }}>Google Sign-In Failed</h2>
          <p>{error}</p>
          <button
            className="primary-button"
            onClick={() => navigate('/login', { replace: true })}
            style={{ marginTop: '16px', width: '100%' }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        background: '#f7f1e9',
        fontSize: '18px',
        fontWeight: 600,
        color: '#30222f',
      }}
    >
      Completing Google sign-in...
    </div>
  );
}
