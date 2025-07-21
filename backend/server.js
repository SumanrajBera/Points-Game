require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes')
const app = express()
const cors = require('cors')

mongoose.connect(process.env.MONGODB_URI)
.then((res)=>console.log("MongoDB connected"))
.catch((err) => console.log("Error connecting MongoDB:",err))

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


// Passport Setup
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message || err);

    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({success: false,message,});
});

app.listen(process.env.PORT,()=>{
    console.log("App is listening on port",process.env.PORT)
})