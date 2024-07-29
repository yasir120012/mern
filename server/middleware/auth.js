const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_default_jwt_secret";

module.exports = (req, res, next) => {
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  // If no token is found, return an error response
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach the user information to the request object
    req.user = decoded;
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, return an error response
    res.status(401).json({ message: "Token is not valid" });
  }
};
