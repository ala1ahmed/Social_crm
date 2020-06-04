const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  region: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
