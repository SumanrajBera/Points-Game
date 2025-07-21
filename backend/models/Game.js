const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  issuedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =  mongoose.model('Game', gameSchema);