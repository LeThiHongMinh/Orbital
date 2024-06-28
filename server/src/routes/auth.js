const { verify } = require('jsonwebtoken');
const { SECRET } = require('../constants');
const { Router } = require('express')
const router = Router();
const db = require('../db'); // Assuming db is your PostgreSQL client instance


const {
  getUsers,
  register,
  login,
  protected,
  logout,
  getProfile,
  updateProfile,
  authenticateToken,
} = require('../controllers/auth')
const {
  validationMiddleware,
} = require('../middlewares/validations-middleware')
const { registerValidation, loginValidation } = require('../validators/auth')
const { userAuth } = require('../middlewares/auth-middleware')

router.get('/get-users', getUsers)
router.get('/protected', userAuth, protected)
router.post('/register', registerValidation, validationMiddleware, register)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)
router.get('/profile', authenticateToken, getProfile)
router.put('/profileupdate',  updateProfile)
router.get("/:id/verify/:token/", async (req, res) => {
	try {
	  const userId = req.params.id;
	  const verificationToken = req.params.token;
  
	  // Check if the user exists in the database
	  const userQuery = 'SELECT * FROM users WHERE user_id = $1';
	  const userResult = await db.query(userQuery, [userId]);
	  const user = userResult.rows[0];
  
	  if (!user) {
		return res.status(400).send({ message: "Invalid link" });
	  }
  
	  // Check if the token exists in the database
	  const tokenQuery = 'SELECT * FROM tokens WHERE user_id = $1 AND token = $2';
	  const tokenResult = await db.query(tokenQuery, [userId, verificationToken]);
	  const token = tokenResult.rows[0];
  
	  if (!token) {
		return res.status(400).send({ message: "Invalid link" });
	  }
  
	  // Update user's verified status and remove the token from database
	  const updateUserQuery = 'UPDATE users SET verified = true WHERE user_id = $1';
	  await db.query(updateUserQuery, [userId]);
  
	  const deleteTokenQuery = 'DELETE FROM tokens WHERE user_id = $1 AND token = $2';
	  await db.query(deleteTokenQuery, [userId, verificationToken]);
  
	  res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
	  console.error('Error verifying email:', error.message);
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
  

module.exports = router