const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { SECRET } = require('../constants');
const db = require('../db');

// Function to extract JWT token from cookies
const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

// Passport strategy options
const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// Passport strategy definition
passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const { rows } = await db.query(
        'SELECT user_id, email FROM users WHERE user_id = $1',
        [jwt_payload.id]
      );

      if (!rows.length) {
        return done(null, false);
      }

      const user = { id: rows[0].user_id, email: rows[0].email };
      return done(null, user);
    } catch (error) {
      console.error('Error in JWT strategy:', error.message);
      return done(error, false);
    }
  })
);

// Middleware to authenticate using passport JWT
exports.userAuth = passport.authenticate('jwt', { session: false });
