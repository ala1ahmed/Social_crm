const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //verfiy token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    if (!req.user.enabled) {
      return res
        .status(401)
        .json({ errors: [{ msg: 'need to verify your email' }] });
    }
    if (req.user.role === 'CM') {
      if (!req.user.Eenabled) {
        return res
          .status(401)
          .json({ errors: [{ msg: 'need company verification' }] });
      }
    }
    console.log(req.user);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
