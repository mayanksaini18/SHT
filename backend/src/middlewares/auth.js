const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Check cookie first, then fall back to Authorization header
  let token = req.cookies?.access_token;

  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(payload.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
