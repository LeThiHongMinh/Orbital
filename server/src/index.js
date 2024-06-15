const express = require('express')
const app = express()
const { PORT, CLIENT_URL } = require('./constants')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require('cors')



//import passport middleware
require('./middlewares/passport-middleware')


//initialize middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(passport.initialize())


//import routes
const authRoutes = require('./routes/auth')
const formRoutes = require('./routes/matchmaking')

//initialize routes
app.use('/api', authRoutes)
app.use('/api', formRoutes)
/*
app.post('/submit_form', async (req, res) => {
  const {fullname, coursecode, expectations, academiclevel, studygoal } = req.body;

  try {
    // Insert form data into the 'matchmaking' table
    const result = await pool.query(
      'INSERT INTO matchmaking (fullname, coursecode, expectations, academiclevel, studygoal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [fullname, coursecode, expectations, academiclevel, studygoal]
    );
    
    res.status(201).json({
      success: true,
      message: 'Form data inserted successfully',
      data: result.rows[0], // Send back the inserted data
    });
  } catch (error) {
    console.error('Error inserting form data:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while inserting form data',
    });
  }
});
*/

//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()