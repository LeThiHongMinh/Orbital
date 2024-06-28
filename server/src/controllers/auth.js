const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('select user_id, email from users')

    return res.status(200).json({
      success: true,
      users: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.register = async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)

    await db.query('insert into users(email,password) values ($1 , $2)', [
      email,
      hashedPassword,
    ])

    return res.status(201).json({
      success: true,
      message: 'The registraion was succefull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.login = async (req, res) => {
  let user = req.user;

  let payload = {
    id: user.user_id,
    email: user.email,
  };

  try {
    const token = await sign(payload, SECRET, { expiresIn: '30d' }); // Set token expiration to 30 days

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.protected = async (req, res) => {
  try {
    return res.status(200).json({
      info: 'protected info',
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.getProfile = async (req, res) => {
  const email = req.user.email; // Use email from decoded JWT token

  try {
    const { rows } = await db.query('SELECT full_name, email, bio FROM users WHERE email = $1', [email]);
    const user = rows[0] || { email };

    if (!user.full_name || !user.bio) {
      return res.status(200).json({
        success: true,
        message: 'Profile incomplete, please update your profile.',
        profileComplete: false,
        user: user,
      });
    }

    return res.status(200).json({
      success: true,
      profileComplete: true,
      user: user,
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};




exports.updateProfile = async (req, res) => {
  const { email, full_name, bio } = req.body; // Extract email, full_name, and bio from req.body

  try {
    const result = await db.query(
      'UPDATE users SET full_name = $1, bio = $2 WHERE email = $3',
      [full_name, bio, email]
    );

    if (result.rowCount === 0) {
      // If no rows were updated, it means the email wasn't found in the database
      return res.status(404).json({
        success: false,
        message: 'User not found with the provided email.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};


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
