const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware function to verify JWT token
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token does not exist
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'jwtSecret');
    console.log(decoded)
    // Add user from payload to request object
    req.user = decoded.user;
    next(); // Call next middleware
  } catch (err) {
    console.log(err)
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
