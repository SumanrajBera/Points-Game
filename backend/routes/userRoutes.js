const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User'); 
const {validateRegister, validateLogin, authenticateJWT}  = require('../middleware')
const wrapAsync = require("../utils/wrapAsync")
const jwt = require("jsonwebtoken");


router.get("/:id", authenticateJWT, wrapAsync(async (req, res) => {
    const user = await User.findById(req.params.id).select('_id username points draws');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }))

router.post(
  '/register',
  validateRegister,
  wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const newUser = new User({ username, email });
    await User.register(newUser, password); 

    res.status(201).json({ message: 'User registered successfully' });
  })
);

router.post(
  '/login',
  validateLogin,
  wrapAsync(async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      // Create JWT
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
      );

      return res.status(200).json({ message: 'Login successful', token });
    })(req, res, next);
  })
);

module.exports = router;