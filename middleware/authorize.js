const jwt = require('jsonwebtoken');
const config = require('config');
const Company = require('../models/Company');

module.exports = async function (req, res, next) {
  let company = await Company.findById(req.user.id);

  if (company) {
    next();
  } else {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};
