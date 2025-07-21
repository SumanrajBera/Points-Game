const mongoose = require('mongoose')

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  points: { type: Number, default: 0 },
  draws: { type: Number, default: 0 }
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)