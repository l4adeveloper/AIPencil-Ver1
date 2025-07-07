const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const authenticateToken = require('../middleware/authenticateToken');

// Traditional login/signup
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google OAuth Login → Trả JWT
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login.html?error=unauthorized',
    session: false
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log(token);
    // Redirect về frontend với JWT (trong URL)
    res.redirect(`http://localhost:3000/index.html?token=${token}`);
  }
);

// Lấy profile qua JWT
router.get('/profile', authenticateToken, profileController.getProfile);

module.exports = router;
