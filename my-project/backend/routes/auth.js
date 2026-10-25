const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getOAuthConfig,
  oauthLogin,
} = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// OAuth routes
router.get('/oauth/config', getOAuthConfig);
router.post('/oauth', oauthLogin);

module.exports = router;
