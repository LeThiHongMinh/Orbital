const express = require('express');
const app = express();
const { PORT, CLIENT_URL } = require('./src/constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const pool = require('./db').pool; // Import the PostgreSQL connection pool

// Import passport middleware
require('./src/middlewares/passport-middleware');

// Initialize middlewares
app.use(express.json());
app.use(cookieParser());

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Remove the extra space
  credentials: true // Allow cookies to be sent to/from the client
};
app.use(cors(corsOptions));

// Initialize Passport
app.use(passport.initialize());

// Import routes
const authRoutes = require('./src/routes/auth');

// Initialize routes
app.use('/api', authRoutes);

// Route to handle form submission
app.post('/submit-form', async (req, res) => {
  try {
    const { fullName, courseCode, expectations, academicLevel, studyGoal } = req.body;
    
    // Insert the form data into the database
    const query = `
      INSERT INTO form_data (full_name, course_code, expectations, academic_level, study_goal)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [fullName, courseCode, expectations, academicLevel, studyGoal]);
    
    res.status(200).send('Form submitted successfully!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start the server
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

appStart();
