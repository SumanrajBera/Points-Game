const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync')
const User = require('../models/User');
const { authenticateJWT } = require('../middleware');
const Claim = require('../models/Claim');
const Game = require('../models/Game')

router.get('/leaderboard', wrapAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;        // Default page = 1
  const limit = parseInt(req.query.limit) || 10;     // Default limit = 10
  const skip = (page - 1) * limit;

  const totalUsers = await User.countDocuments(); // For frontend if needed

  const topUsers = await User.find({})
    .select('_id username points')
    .sort({ points: -1, _id: 1 }) // Tiebreaker
    .skip(skip)
    .limit(limit);

  res.json({
    users: topUsers,
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit)
  });
}));

router.post('/claim', authenticateJWT, wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.draws <= 0) return res.status(400).json({ message: "No draws left" });

  const randomPoints = Math.floor(Math.random() * 10) + 1;

  user.points += randomPoints;
  user.draws -= 1;
  await user.save();

  await Claim.create({
    user: user._id,
    points: randomPoints
  });

  res.status(200).json({
    points: user.points,
    draws: user.draws,
    earned: randomPoints
  });
}));

router.get('/history/:userId', authenticateJWT, wrapAsync(async (req, res) => {
  const { userId } = req.params;

  const claims = await Claim.find({ user: userId })
    .sort({ claimedAt: -1 })            // Most recent first
    .limit(5)                     // Optional: limit to last 20 claims
    .select('_id points claimedAt');    // Optional: keep payload light

  res.json(claims);
}));

router.post('/createGames', authenticateJWT, wrapAsync(async (req, res) => {
  const { name } = req.body;
  const issuer = req.user.id;

  if (!name) {
    return res.status(400).json({ message: "Game name is required" });
  }

  const newGame = new Game({ name, issuer, participants: [] });
  await newGame.save();

  res.status(201).json({ message: "Game created successfully", game: newGame });
}));

router.get('/myGames', authenticateJWT, wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const myGames = await Game.find({ issuer: userId }).populate('participants', 'username');

  res.status(200).json(myGames);
}));

router.get('/availableGames', authenticateJWT, wrapAsync(async (req, res) => {
  const currentUserId = req.user.id;

  const availableGames = await Game.find({
    issuer: { $ne: currentUserId }, // Not issued by current user
    participants: { $ne: currentUserId }, // Not already joined
  }).populate('issuer', 'username');

  res.json(availableGames);
}));

router.post('/participate/:gameId', authenticateJWT, wrapAsync(async (req, res) => {
  const userId = req.user.id;
  const gameId = req.params.gameId;

  const game = await Game.findById(gameId);
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }

  if (String(game.issuer) === userId) {
    return res.status(400).json({ message: "Issuer can't participate in their own game" });
  }

  if (game.participants.includes(userId)) {
    return res.status(400).json({ message: 'You have already participated in this game' });
  }

  if (game.participants.length >= 10) {
    return res.status(400).json({ message: 'This game already has 10 participants' });
  }

  // Add user to participants
  game.participants.push(userId);
  await game.save();

  res.json({ message: 'Successfully participated in the game' });
})
);

router.get('/view/:gameId', authenticateJWT, wrapAsync(async (req, res) => {
  const gameId = req.params.gameId;

  const game = await Game.findById(gameId)
    .populate('issuer', 'username') // only return username of issuer
    .populate('participants', 'username'); // only return username of participants

  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }

  res.json(game);
}))

router.post('/issue-and-delete/:gameId/:participantId', authenticateJWT, wrapAsync(async (req, res) => {
  const { gameId, participantId } = req.params;
  const issuerId = req.user.id;

  const game = await Game.findById(gameId);
  if (!game) return res.status(404).json({ message: "Game not found" });

  if (game.issuer.toString() !== issuerId)
    return res.status(403).json({ message: "Only the issuer can issue draws and delete the game" });

  if (!game.participants.includes(participantId)) {
    return res.status(400).json({ message: "Participant not in this game" });
  }

  // Issue 1 draw to participant
  await User.findByIdAndUpdate(participantId, { $inc: { draws: 1 } });

  await game.deleteOne(); // Delete the game

  res.json({ message: "Draw issued to participant and game deleted" });
}));

module.exports = router;