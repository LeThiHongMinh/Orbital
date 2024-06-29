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
    const token = await jwt.sign(payload, SECRET, { expiresIn: '30d' }); // Set token expiration to 30 days

    return res.status(200).cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    }).json({
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
    const { rows } = await db.query('SELECT full_name, email, bio, username FROM profile WHERE email = $1', [email]);
    const user = rows[0] || { email };

    if (!user.full_name || !user.bio || !user.username) {
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
  const { full_name, email, password, username, bio } = req.body;

  try {
    // Update profile table
    const updateProfileQuery = `
      UPDATE profile
      SET full_name = COALESCE($1, full_name),
          email = COALESCE($2, email),
          password = COALESCE($3, password),
          username = COALESCE($4, username),
          bio = COALESCE($5, bio)
      WHERE user_id = $6
    `;
    await db.query(updateProfileQuery, [full_name, email, password, username, bio, req.user.user_id]);

    // Update users table if email or password is updated
    if (email && email !== req.user.email || password) {
      const updateUserQuery = `
        UPDATE users
        SET email = $1,
            password = $2
        WHERE user_id = $3
      `;
      await db.query(updateUserQuery, [email || req.user.email, password || req.user.password, req.user.user_id]);
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.checkProfile = async (req, res) => {
  const email = req.user.email; // Extract email from authenticated user
  try {
    const { rows } = await db.query('SELECT * FROM profile WHERE email = $1', [email]);
    const profile = rows[0];
    if (profile) {
      // Profile exists, return profile data
      return res.status(200).json({
        success: true,
        profileExists: true,
        profile,
      });
    } else {
      // No profile found
      return res.status(200).json({
        success: true,
        profileExists: false,
      });
    }
  } catch (error) {
    console.error('Error checking profile:', error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Create profile
exports.createProfile = async (req, res) => {
  const { full_name, email, password, username, bio } = req.body;

  try {
    // Check if profile already exists for the user
    const existingProfileQuery = 'SELECT * FROM profile WHERE user_id = $1';
    const existingProfileResult = await db.query(existingProfileQuery, [req.user.user_id]);
    const existingProfile = existingProfileResult.rows[0];

    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }

    // Default to user's email and password if not provided in request
    const userEmail = email || req.user.email;
    const userPassword = password || req.user.password;

    // Create new profile
    const createProfileQuery = `
      INSERT INTO profile (user_id, full_name, email, password, username, bio)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.query(createProfileQuery, [req.user.user_id, full_name, userEmail, userPassword, username, bio]);

    res.status(201).json({ message: 'Profile created successfully' });
  } catch (error) {
    console.error('Error creating profile:', error.message);
    res.status(500).json({ error: error.message });
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
