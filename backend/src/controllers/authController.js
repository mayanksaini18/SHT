const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createAccessToken, createRefreshToken } = require('../utils/tokens');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jid', refreshToken, { httpOnly: true, sameSite: 'lax' });
    res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();

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
