const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')

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
      message: 'The registration was succefull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.login = async (req, res) => {
  let user = req.user

  let payload = {
    id: user.user_id,
    email: user.email,
  }

  try {
    const token = await sign(payload, SECRET)

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in successfully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.protected = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { rows } = await db.query('SELECT email, full_name, bio FROM users WHERE user_id = $1', [userId]);

    if (rows.length > 0) {
      const userInfo = rows[0];
      return res.status(200).json({
        success: true,
        info: userInfo,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

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
// Assuming you have a function to update user profile in auth.js

exports.updateProfile = async (req, res) => {
  const userId = req.user.user_id;
  const { fullName, bio } = req.body;

  try {
    await db.query('UPDATE users SET full_name = $1, bio = $2 WHERE user_id = $3', [
      fullName,
      bio,
      userId,
    ]);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
exports.getProfile = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const { rows } = await db.query('SELECT email, full_name, bio FROM users WHERE user_id = $1', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      profile: rows[0],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
