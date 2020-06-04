const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const auth = require('../../middleware/auth');
const Company = require('../../models/Company');
const User = require('../../models/User');
const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

let transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    // should be replaced with real sender's account
    user: 'ala.ahmed@esprit.tn',
    pass: 'pandacod66974',
  },
});

// @route  POST api/users
// @desc   Register CM
// @access Public
router.post(
  '/',
  [
    check('name', 'Entreprise name is required').not().isEmpty(),
    check('company', 'company name is required').not().isEmpty(),
    check('email', 'Please inculed a valid email').isEmail(),
    check(
      'password',
      'Please Enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, company } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already Exists' }] });
      }
      let company = await Company.findOne({ name: company });
      if (company) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Company cannot be found' }] });
      }
      const token = crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          console.log(err);
          res.status(500).send(`Server Error`);
        }
        return buffer.toString('hex');
      });

      user = new User({
        name,
        email,
        password,
        company,
        token,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      transporter.sendMail({
        to: email,
        from: 'no-reply@social-crm.com',
        subject: 'Signup succeded',
        html: `<h1>You successfully signed up</h1><h2>You need to verify your account</h2>
        <a href="http://localhost:3000/email-verification/${token}">Click here!!</a>`,
      });
      return res.status(201).json({ status: false });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
