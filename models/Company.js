const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  resetToken: String,
  resetTokenExpiration: Date,
  token: {
    type: String,
    required: false,
  },
  facebookLink: {
    type: String,
    required: false,
  },
  linkedinLink: {
    type: String,
    required: false,
  },
  instagramLink: {
    type: String,
    required: false,
  },
  twitterLink: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  postalCode: {
    type: String,
    required: false,
  },
});

module.exports = Company = mongoose.model('company', CompanySchema);
