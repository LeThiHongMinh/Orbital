const express = require('express')
const app = express()
const { PORT, CLIENT_URL } = require('./constants')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require('cors')
const path = require('path');


//import passport middleware
require('./middlewares/passport-middleware')


//initialize middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'https://nustudyseeker.vercel.app', credentials: true }))
app.use(passport.initialize())


//import routes
const authRoutes = require('./routes/auth')
const formRoutes = require('./routes/matchmaking')
const uploadRouter = require('./routes/uploadRouter')
const studyActivitiesRoutes = require('./routes/study-activities');

//initialize routes
app.use('/api', authRoutes)
app.use('/api', formRoutes)
app.use('/api', uploadRouter)
app.use('/api', studyActivitiesRoutes);

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