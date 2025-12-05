const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createAccessToken, createRefreshToken } = require('../utils/tokens');

exports.register = async (req, res, next) => {
  // --- CHECKPOINT: Register function entry ---
  console.log('--- Register attempt started ---');
  console.log('Request body:', req.body);
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      console.log(`Registration failed: Email already exists for ${email}`);
      return res.status(400).json({ message: 'Email exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    // Stores refresh token in database
   // Helps validate refresh requests
    user.refreshToken = refreshToken;
    await user.save();

    // Creates cookie named jid
   // httpOnly = cannot be accessed by JavaScript
  // sameSite: 'lax' = safe from CSRF
    res.cookie('jid', refreshToken, { httpOnly: true, sameSite: 'lax' });

    // --- CHECKPOINT: Registration successful ---
    console.log(`Registration successful for ${user.email}. Sending tokens.`);
    res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    // --- CHECKPOINT: Catch any unexpected registration error ---
    console.error('---!!! UNEXPECTED REGISTER ERROR !!!---', err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  // --- CHECKPOINT: Login function entry ---
  console.log('--- Login attempt started ---');
  console.log('Request body:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: No user found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log(`User found: ${user.email}`);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log(`Login failed: Password mismatch for user: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log(`Password matched for user: ${email}`);

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    console.log(`Login successful for user: ${email}. Setting cookie and sending tokens.`);
    res.cookie('jid', refreshToken, { httpOnly: true, sameSite: 'lax' });
    
    res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name, xp: user.xp, level: user.level } });
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.jid || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const payload = require('jsonwebtoken').verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = createAccessToken({ id: user._id });
    res.json({ accessToken });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    xp: req.user.xp,
    level: req.user.level,
  });
};
