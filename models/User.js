const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  Entrepriseenabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  company: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
  },
});

module.exports = User = mongoose.model('user', UserSchema);
