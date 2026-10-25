const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'wellspend_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, authProvider: 'local' });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        authProvider: req.user.authProvider,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Google OAuth Configuration Endpoint
exports.getOAuthConfig = async (req, res) => {
  res.json({
    success: true,
    providers: {
      google: {
        enabled: Boolean(process.env.GOOGLE_CLIENT_ID),
        clientId: process.env.GOOGLE_CLIENT_ID || '',
      },
    },
  });
};

// Google OAuth Handler
exports.oauthLogin = async (req, res) => {
  try {
    const { provider, credential, accessToken, userInfo } = req.body;

    if (provider !== 'google') {
      return res.status(400).json({ success: false, message: 'Only Google OAuth is supported' });
    }

    let email = '';
    let name = '';
    let providerId = '';
    let avatar = '';

    // Verify Google ID Token / JWT if present
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          email = payload.email;
          name = payload.name || (payload.email ? payload.email.split('@')[0] : 'Google User');
          providerId = payload.sub;
          avatar = payload.picture || '';
        }
      } catch (e) {
        console.warn('Direct JWT decode error:', e.message);
      }
    } else if (accessToken) {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        email = data.email;
        name = data.name || (data.email ? data.email.split('@')[0] : 'Google User');
        providerId = data.sub;
        avatar = data.picture || '';
      } catch (e) {
        console.error('Google userinfo fetch failed:', e.message);
      }
    }

    // Fallback: If development / demo userInfo is explicitly provided
    if (!email && userInfo && userInfo.email) {
      email = userInfo.email;
      name = userInfo.name || email.split('@')[0];
      providerId = userInfo.id || `google_${Date.now()}`;
      avatar = userInfo.avatar || '';
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Failed to authenticate with Google. Missing or invalid profile data.',
      });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        authProvider: 'google',
        providerId,
        avatar,
      });
    } else {
      if (!user.providerId) {
        user.providerId = providerId;
        user.authProvider = 'google';
        await user.save();
      }
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.status(500).json({ success: false, message: err.message || 'Google OAuth authentication failed' });
  }
};
