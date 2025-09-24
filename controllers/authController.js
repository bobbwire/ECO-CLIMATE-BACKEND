// controllers/authController.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendEmailFactory = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_LONG_EXPIRES_IN = process.env.JWT_LONG_EXPIRES_IN || '30d';
const RESET_PASSWORD_EXPIRES_MIN = Number(process.env.RESET_PASSWORD_EXPIRES_MIN || 60);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5000';

const sendEmail = sendEmailFactory({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.FROM_EMAIL
});

const signToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? JWT_LONG_EXPIRES_IN : JWT_EXPIRES_IN;
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
};

exports.register = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { name, email, password, userType, location, interests } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashed,
      userType,
      location,
      interests
    });

    await user.save();

    const token = signToken(user._id, false);

    // return user profile (without password)
    const { password: _, resetPasswordToken, resetPasswordExpires, ...userData } = user.toObject();

    res.status(201).json({ token, user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id, rememberMe);

    const { password: _, resetPasswordToken, resetPasswordExpires, ...userData } = user.toObject();

    res.json({ token, user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If the email exists, an email was sent.' }); // avoid revealing existence

    const token = user.createPasswordResetToken(RESET_PASSWORD_EXPIRES_MIN);
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const text = `You requested a password reset.\n\nClick the link to reset your password (expires in ${RESET_PASSWORD_EXPIRES_MIN} minutes):\n\n${resetUrl}`;

    await sendEmail({ to: email, subject: 'EcoAction Password Reset', text, html: `<p>${text}</p>` });

    res.json({ message: 'If the email exists, an email was sent.' });
  } catch (err) {
    console.error('forgotPassword error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password, email } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.clearPasswordReset();

    await user.save();

    // auto-login after reset
    const jwtToken = signToken(user._id, false);

    res.json({ message: 'Password reset successful', token: jwtToken });
  } catch (err) {
    console.error('resetPassword error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
