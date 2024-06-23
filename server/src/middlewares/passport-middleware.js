const passport = require('passport');
const { Strategy } = require('passport-jwt');
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
  jwtFromRequest: cookieExtractor,
};

// Passport strategy definition
passport.use(
  new Strategy(opts, async ({ id }, done) => {
    try {
      const { rows } = await db.query(
        'SELECT user_id, email FROM users WHERE user_id = $1',
        [id]
      );

      if (!rows.length) {
        throw new Error('401 not authorized');
      }

      const user = { id: rows[0].user_id, email: rows[0].email };
      return await done(null, user);
    } catch (error) {
      console.log(error.message);
      return done(null, false);
    }
  })
);

// Middleware to authenticate using passport JWT
exports.userAuth = passport.authenticate('jwt', { session: false });
