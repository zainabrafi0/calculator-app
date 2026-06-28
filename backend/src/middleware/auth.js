const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Read the token directly from the cookie!
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;