const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Company = require('../../models/Company');
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

// @route  GET api/auth
// @desc   get athenticated user
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route  POST api/auth
// @desc   Authenticate user & get token
// @access Public
router.post(
  '/',
  [
    check('email', 'Please inculed a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      let company = await Company.findOne({ email });
      let payload = {};
      if (!user && !company) {
        return res.status(400).json({ msg: 'Unexisted Account' });
      }
      if (!company) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ msg: 'Wrong Password' });
        }
        let enabled = false;
        if (user.token != null) {
          return res.status(400).json({ msg: 'Need email verification' });
        }
        if (!user.Entrepriseenabled) {
          return res.status(400).json({ msg: 'Need Entreprise verification' });
        }
        payload = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          role: 'CM',
        };
      } else {
        const isMatch = await bcrypt.compare(password, company.password);

        if (!isMatch) {
          return res.status(400).json({ msg: 'Wrong Password' });
        }
        let enabled = false;
        if (company.token != null) {
          return res.status(400).json({ msg: 'Need email verification' });
        }
        payload = {
          user: {
            id: company.id,
            name: company.name,
            email: company.email,
          },
          role: 'Company',
        };
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //res.send('User registred');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  POST api/auth/reset
// @desc   Reset password
// @access Public
router.post(
  '/reset',
  check('email', 'Please inculed a valid email').isEmail(),
  async (req, res) => {
    const email = req.body.email;

    let user = await User.findOne({ email });
    let company = await Company.findOne({ email });
    if (!user && !company) {
      return res.status(400).json({ msg: 'Unexisted Account' });
    }
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Server Error`);
      }
      const token = buffer.toString('hex');
      if (company) {
        company.resetToken = token;
        company.resetTokenExpiration = Date.now() + 3600;
        company.save();
      } else {
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600;
        user.save();
      }
      transporter.sendMail({
        to: company.email,
        from: 'no-reply@social-crm.com',
        subject: 'Reset Password',
        html: `
            <h1>You requested a password reset</h1>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>
        `,
      });
    });
    return res.status(200).json({
      msg:
        'An email was sent to your account you need to reset your password in 1 hour',
    });
  }
);

// @route  GET api/auth/reset/:token
// @desc   get user by token and check token's validity
// @access Public (only if the token is right)

router.get('/reset/:token', async (req, res) => {
  const token = req.params.token;
  let user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() - 3600, $lte: Date.now() },
  }).select('-password');
  let company = await Company.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() - 3600, $lte: Date.now() },
  }).select('-password');
  if (!user && !company) {
    return res.status(400).json({ errors: [{ msg: 'Invalid Token' }] });
  }
  if (company) {
    return res.status(200).json(company);
  }
  if (user) {
    return res.status(200).json(user);
  }
});

// @route  POST api/auth/new-password
// @desc   get user by token and check token's validity
// @access Public (only if the token is right)
router.post(
  '/new-password',
  [
    check('token', 'Token is reaquired').not().notEmpty(),
    check(
      'password',
      'Please Enter a password with 8 or more characters'
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const { token, password } = req.body.userData;
    let user = await User.findOne({
      resetToken: token,
    });
    let company = await Company.findOne({
      resetToken: token,
    });
    if (!user && !company) {
      return res.status(400).json({ msg: 'Invalid token check again' });
    }
    if (company) {
      const salt = await bcrypt.genSalt(10);

      company.password = await bcrypt.hash(password, salt);

      await company.save();
    }
    if (user) {
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
    }

    return res.status(201).json({ msg: 'password updated' });
  }
);

// @route  POST api/auth/verification/:token
// @desc   get user by token and check token's validity
// @access Public (only if the token is right)
router.post('/verification', async (req, res) => {
  const token = req.body.token;

  let user = await User.findOne({ token }).select('-password');
  let company = await Company.findOne({ token }).select('-password');
  if (!company && !user) {
    return res.status(400).json({ msg: 'Invalid Token' });
  }
  if (user) {
    user.token = null;
    await user.save();
    return res.status(200).json({ msg: 'Account verified' });
  }
  if (company) {
    company.token = null;
    await company.save();
    return res.status(200).json({ msg: 'account verified' });
  }
});

module.exports = router;
