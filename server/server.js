const express = require('express');
const app = express();
const { PORT, CLIENT_URL } = require('./src/constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');

// Import passport middleware
require('./src/middlewares/passport-middleware');

// Initialize middlewares
app.use(express.json());
app.use(cookieParser());

// Configure CORS
const corsOptions = {
  origin: 'https://orbital-coral.vercel.app', // Allow requests only from CLIENT_URL
  credentials: true // Allow cookies to be sent to/from the client
};
app.use(cors(corsOptions));

// Initialize Passport
app.use(passport.initialize());

// Import routes
const authRoutes = require('./src/routes/auth');

// Initialize routes
app.use('/api', authRoutes);

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
