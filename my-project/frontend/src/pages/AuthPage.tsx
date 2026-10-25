import React, { useState, FormEvent, useEffect } from 'react';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import {
  loginUser,
  registerUser,
  oauthLogin,
  getOAuthConfig,
  type OAuthConfig,
} from '../services/authService';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthConfig, setOAuthConfig] = useState<OAuthConfig | null>(null);

  // Modal for Google OAuth configuration instructions & demo testing
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const { login } = useAuth();
  const isSignup = mode === 'signup';

  useEffect(() => {
    getOAuthConfig()
      .then(setOAuthConfig)
      .catch((err) => console.warn('Could not fetch OAuth config:', err.message));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const res = await registerUser({ name, email, password });
        login(res.token, res.user);
      } else {
        const res = await loginUser({ email, password });
        login(res.token, res.user);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setError('');
    const redirectUri = `${window.location.origin}/oauth/callback`;

    // Check config from backend or fallback to frontend .env
    let googleClientId =
      oauthConfig?.providers?.google?.clientId ||
      import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      try {
        const freshConfig = await getOAuthConfig();
        setOAuthConfig(freshConfig);
        googleClientId = freshConfig?.providers?.google?.clientId;
      } catch (e) {
        console.warn('Could not re-fetch config:', e);
      }
    }

    if (googleClientId) {
      // Launch standard Google OAuth redirect
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token%20id_token&scope=openid%20profile%20email&nonce=${Date.now()}`;
      window.location.href = url;
      return;
    }

    // If Google Client ID is not found, open setup modal
    setShowGoogleModal(true);
  };

  const handleDemoGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await oauthLogin({
        provider: 'google',
        userInfo: {
          name: 'Alex Morgan (Google)',
          email: 'alex.morgan.google@gmail.com',
          id: 'google_demo_10928374',
        },
      });

      setShowGoogleModal(false);
      login(res.token, res.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google OAuth login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <button className="brand auth-brand" onClick={() => setMode('login')} type="button">
          <span className="brand-mark">
            <Icon name="chart" />
          </span>
          <span>
            Wellspend<span className="brand-dot">.</span>
          </span>
        </button>
        <div className="auth-message">
          <p className="auth-kicker">MONEY, MADE SIMPLE</p>
          <h1>
            Spend smarter.
            <br />
            Live <em>freer.</em>
          </h1>
          <p>Join thousands building healthier money habits, one clear decision at a time.</p>
        </div>
        <div className="auth-preview">
          <div className="preview-head">
            <span>Monthly overview</span>
            <span className="preview-pill">+8.4%</span>
          </div>
          <strong>$12,648.20</strong>
          <div className="preview-chart">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <p className="auth-quote">
          "Wellspend helped me finally feel in control of my finances." <strong>— Jamie R.</strong>
        </p>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <span className="brand-mark">
              <Icon name="chart" />
            </span>
            <strong>
              Wellspend<span>.</span>
            </strong>
          </div>
          <div className="auth-tabs" aria-label="Authentication options">
            <button
              type="button"
              className={!isSignup ? 'active' : ''}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={isSignup ? 'active' : ''}
              onClick={() => {
                setMode('signup');
                setError('');
              }}
            >
              Create account
            </button>
          </div>
          <p className="eyebrow">{isSignup ? 'START YOUR JOURNEY' : 'WELCOME BACK'}</p>
          <h2>{isSignup ? 'Create your account' : 'Good to see you again.'}</h2>
          <p className="auth-subtitle">
            {isSignup
              ? 'A clearer financial future starts here.'
              : 'Enter your details to access your finances.'}
          </p>

          {error && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label>
                Full name
                <div className="auth-input">
                  <Icon name="user" />
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </label>
            )}
            <label>
              Email address
              <div className="auth-input">
                <Icon name="mail" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>
            <label>
              Password
              <div className="auth-input">
                <Icon name="lock" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Show password"
                >
                  <Icon name="eye" />
                </button>
              </div>
            </label>
            {isSignup && (
              <label className="check-row">
                <input type="checkbox" required />
                <span>
                  I agree to the <button type="button">Terms</button> and{' '}
                  <button type="button">Privacy Policy</button>.
                </span>
              </label>
            )}
            {!isSignup && (
              <div className="auth-options">
                <label className="check-row">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button">Forgot password?</button>
              </div>
            )}
            <button className="primary-button auth-submit" type="submit" disabled={loading}>
              {loading
                ? 'Processing...'
                : isSignup
                ? 'Create my account'
                : 'Sign in to Wellspend'}{' '}
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons" style={{ gridTemplateColumns: '1fr' }}>
            <button
              type="button"
              onClick={handleGoogleClick}
              title="Sign in with Google"
              style={{
                height: '46px',
                fontSize: '13px',
                width: '100%',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <strong className="google-mark" style={{ fontSize: '18px', marginRight: 0 }}>
                G
              </strong>{' '}
              Continue with Google
            </button>
          </div>

          <p className="auth-switch">
            {isSignup ? 'Already have an account?' : 'New to Wellspend?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(isSignup ? 'login' : 'signup');
                setError('');
              }}
            >
              {isSignup ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>
      </section>

      {/* Google OAuth Setup & Demo Modal */}
      {showGoogleModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowGoogleModal(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">GOOGLE OAUTH 2.0</p>
                <h2>Google Authentication</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowGoogleModal(false)}
                aria-label="Close"
                type="button"
              >
                <Icon name="close" />
              </button>
            </div>

            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: '0 0 16px 0' }}>
              To connect real live <strong>Google</strong> accounts, add your free Google Client ID in{' '}
              <code>backend/.env</code>:
            </p>

            <div
              style={{
                background: '#2c1f2c',
                color: '#ef8354',
                padding: '12px 16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              GOOGLE_CLIENT_ID=817812169800-qaqgr71e9f6g2a4hhknfic5tti4sgedc.apps.googleusercontent.com
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="primary-button"
                type="button"
                onClick={handleDemoGoogleLogin}
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? 'Authenticating...' : 'Continue as Demo Google User'}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowGoogleModal(false)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
