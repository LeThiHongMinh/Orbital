const db = require('../db');
const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT user_id, email FROM users');
    return res.status(200).json({ success: true, users: rows });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await hash(password, 10);
    await db.query('INSERT INTO users(email, password) VALUES ($1, $2)', [email, hashedPassword]);
    return res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const user = req.user;
  const payload = { id: user.user_id, email: user.email };

  try {
    const token = await jwt.sign(payload, SECRET, { expiresIn: '30d' });
    return res.status(200).cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    }).json({ success: true, message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.protected = async (req, res) => {
  try {
    return res.status(200).json({ info: 'Protected info' });
  } catch (error) {
    console.error('Error accessing protected route:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  const email = req.user.email;
  try {
    const { rows: userRows } = await db.query('SELECT full_name, email, bio, tele, avatar FROM users WHERE email = $1', [email]);
    const user = userRows[0] || { email };

    if (!user.full_name || !user.bio) {
      return res.status(200).json({ success: true, message: 'Profile incomplete, please update your profile.', profileComplete: false, user });
    }

    if (user.avatar) {
      user.avatar = `data:image/png;base64,${user.avatar.toString('base64')}`;
    }

    return res.status(200).json({ success: true, profileComplete: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { email, full_name, bio, tele } = req.body;
  let avatar = null;
  const user_id = req.user.id;

  if (req.file && req.file.buffer) {
    avatar = req.file.buffer;
  }

  try {
    const result = await db.query('UPDATE users SET full_name = $1, bio = $2, tele = $3, avatar = $4 WHERE user_id = $5', [full_name, bio, tele, avatar, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
