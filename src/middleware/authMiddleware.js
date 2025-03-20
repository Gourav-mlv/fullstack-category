const jwt = require("jsonwebtoken");
const logger = require('../config/log').getLogger('AuthMiddleware');
exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    logger.info(decoded);
    req.user = decoded.username;
    next();
  } catch (error) {
    logger.error("Error verifying token:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};
