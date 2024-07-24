// Example of authentication middleware using JWT
const jwt = require('jsonwebtoken');
const { SECRET } = require('../constants');

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.sendStatus(403); // Other JWT verification errors
    }
    req.user = user;
    next();
  });
};
