const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('../config/db');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const googleId = profile.id;

      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (result.rows.length > 0) {
        const user = result.rows[0];

        if (!user.is_approved) {
          return done(null, false, { message: 'Tài khoản chưa được duyệt' });
        }

        if (user.provider !== 'google') {
          return done(null, false, { message: 'Email đã tồn tại bằng phương thức khác' });
        }

        return done(null, user);
      }

      // Nếu chưa tồn tại, tạo mới user chưa duyệt
      const newUser = await pool.query(`
        INSERT INTO users (email, name, provider, google_id, is_approved)
        VALUES ($1, $2, 'google', $3, false)
        RETURNING *;
      `, [email, name, googleId]);

      return done(null, newUser.rows[0]);

    } catch (err) {
      console.error('Google OAuth Error:', err);
      return done(err, false);
    }
  }
));

// ❌ KHÔNG cần serializeUser / deserializeUser nếu dùng JWT
