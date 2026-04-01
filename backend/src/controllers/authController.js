const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const User = require('../models/User');
const { createAccessToken, createRefreshToken } = require('../utils/tokens');

const isProd = process.env.NODE_ENV === 'production';

function setCookieAndRespond(res, user, accessToken, refreshToken) {
  res.cookie('jid', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.json({
    accessToken,
    user: { id: user._id, email: user.email, name: user.name, xp: user.xp, level: user.level }
  });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    setCookieAndRespond(res, user, accessToken, refreshToken);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    setCookieAndRespond(res, user, accessToken, refreshToken);
  } catch (err) { next(err); }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Firebase ID token is required' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid } = decoded;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: await bcrypt.hash(uid + Date.now(), 10),
      });
    }

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    setCookieAndRespond(res, user, accessToken, refreshToken);
  } catch (err) {
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return res.status(401).json({ message: 'Invalid or expired Google token' });
    }
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.jid || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = createAccessToken({ id: user._id });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    next(err);
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('jid', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.clearCookie('access_token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.json({ message: 'Logged out' });
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
