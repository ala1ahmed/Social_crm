const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');

const Company = require('../../models/Company');
const User = require('../../models/User');
const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
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

// @route  POST api/company
// @desc   Register Company
// @access Public
router.post(
  '/',
  [
    check('name', 'Entreprise name is required').not().isEmpty(),
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

    const { name, email, password } = req.body;

    try {
      let company = await Company.findOne({ email });
      company = await Company.findOne({ name });
      if (company) {
        return res.status(400).json({ msg: 'Company already Exists' });
      }
      const token = await crypto.randomBytes(32).toString('hex');
      console.log(token);
      company = new Company({
        name,
        email,
        password,
        token,
      });

      const salt = await bcrypt.genSalt(10);

      company.password = await bcrypt.hash(password, salt);

      await company.save();

      const payload = {
        company: {
          id: company.id,
        },
      };

      transporter.sendMail({
        to: email,
        subject: 'Signup succeded',
        html: `<h1>You successfully signed up</h1><h2>You need to verify your account</h2>
        <a href="http://localhost:3000/email-verification/${token}">Click here!!</a>`,
      });

      return res.status(201).json({ status: false });

      //res.send('User registred');
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);
// @route  GET api/company
// @desc   Get Company
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.user.id).select('-password');

    if (company) return res.status(200).json(company);
    else return res.status(400).json({ msg: 'Unexisted profile' });
  } catch (err) {
    console.error(er.message);
    return res.status(500).send('Server Error');
  }
});

// @route  GET api/company/all
// @desc   Get All companies
// @access Public
router.get('/all', async (req, res) => {
  try {
    const companies = await Company.find().select('-password');

    return res.status(200).json(companies);
  } catch (err) {
    console.error(er.message);
    return res.status(500).send('Server Error');
  }
});

// @route  GET api/company/cm
// @desc   Get Company's community managers
// @access Private
router.get('/cm', [auth, authorize], async (req, res) => {
  try {
    const cms = await User.find({ company: req.user.id });

    return res.status(200).json(cms);
  } catch (err) {
    console.error(er.message);
    return res.status(500).send('Server Error');
  }
});

// @route  POST api/company/cm/:cm_id
// @desc   verify Company's community manager
// @access Private
router.post(
  '/cm/cm_id',
  [auth, authorize, check('cm_id', 'Community manager s id is required')],
  async (req, res) => {
    try {
      const cmId = req.body.cm_id;
      const cm = await User.findById(cmId);
      if (cm.company.id != req.user.id) {
        return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
      }

      cm.Entrepriseenabled = true;
      await cm.save();
      return res.status(200).json({ msg: 'account verified' });
    } catch (err) {
      console.error(er.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route  GET api/company/cm/:cm_id
// @desc   Get Company's community manager profile
// @access Private
router.post(
  '/cm/cm_id',
  [auth, authorize, check('cm_id', 'Community manager s id is required')],
  async (req, res) => {
    try {
      const cmId = req.body.cm_id;
      const cm = await User.findById(cmId);
      if (cm.company.id != req.user.id) {
        return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
      }

      return res.status(200).json(cm);
    } catch (err) {
      console.error(er.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route  PUT api/company/update
// @desc   update Company's profile
// @access Private
router.put('/update', auth, async (req, res) => {
  try {
    const {
      facebookLink,
      twitterLink,
      instagramLink,
      linkedinLink,
      address,
      city,
      country,
      postalCode,
      name,
    } = req.body;
    let company = await Company.findById(req.user.id);
    if (facebookLink) company.facebookLink = facebookLink;
    if (twitterLink) company.twitterLink = twitterLink;
    if (instagramLink) company.instagramLink = instagramLink;
    if (linkedinLink) company.linkedinLink = linkedinLink;
    if (address) company.address = address;
    if (city) company.city = city;
    if (country) company.country = country;
    if (postalCode) company.postalCode = postalCode;
    if (name) company.name = name;

    await company.save();

    res.status(202).json({ msg: 'Porfile updated successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});
module.exports = router;
