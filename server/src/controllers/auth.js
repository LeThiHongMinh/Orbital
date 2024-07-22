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
      message: 'The registration was successful',
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
    const token = await jwt.sign(payload, SECRET, { expiresIn: '30d' }); // Set token expiration to 30 days

    return res.status(200).cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    }).json({
      success: true,
      message: 'Logged in successfully',
      token: token // Add the token to the response JSON
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
    // Fetch user details
    const { rows: userRows } = await db.query('SELECT full_name, email, bio, tele, avatar FROM users WHERE email = $1', [email]);
    const user = userRows[0] || { email };

    if (!user.full_name || !user.bio) {
      return res.status(200).json({
        success: true,
        message: 'Profile incomplete, please update your profile.',
        profileComplete: false,
        user: user,
      });
    }

    // Convert avatar from BYTEA to Base64 if it exists
    if (user.avatar) {
      user.avatar = `data:image/png;base64,${user.avatar.toString('base64')}`;
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
  const { email, full_name, bio, tele } = req.body; // Extract email, full_name, and bio from req.body

  let avatar = null;

  if (req.file && req.file.buffer) {
    avatar = req.file.buffer;
  }

  try {
    // Update user profile including avatar if provided
    const result = await db.query(
      'UPDATE users SET full_name = $1, bio = $2, tele = $3, avatar = $4 WHERE email = $5',
      [full_name, bio, tele, avatar, email]
    );

    if (result.rowCount === 0) {
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
