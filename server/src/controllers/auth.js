const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail')


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
  const { email, password } = req.body;

  try {
    // Check if email already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(checkUserQuery, [email]);

    if (rows.length > 0) {
      return res.status(400).json({
        errors: [
          {
            type: 'field',
            value: email,
            msg: 'Email already exists.',
            path: 'email',
            location: 'body',
          },
        ],
      });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert user into database
    const insertUserQuery = 'INSERT INTO users(email, password) VALUES ($1 , $2) RETURNING user_id';
    const result = await db.query(insertUserQuery, [
      email,
      hashedPassword,
    ]);

    const user_id = result.rows[0].user_id;

    // Generate JWT token
    const token = sign({ user_id, email }, SECRET, { expiresIn: '10m' });

    // Construct verification URL (assuming BASE_URL is defined in environment variables)
    const url = `${process.env.BASE_URL}/verify-email?token=${token}`;

    // Send verification email
    await sendEmail(email, 'Verify Email', `Hi there! Thank you for registering for our website, please click the link below to verify your email: ${url}`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Verification email sent.',
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};


exports.login = async (req, res) => {
  let user = req.user

  let payload = {
    id: user.user_id,
    email: user.email,
  }

  try {
    const token = await jwt.sign(payload, SECRET, { expiresIn: '1h' });

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in succefully',
      token,
    })
    res
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

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
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

