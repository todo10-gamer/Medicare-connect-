// =============================================
//   middleware/authMiddleware.js
//   Protects routes - only logged in users can access them
// =============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// -----------------------------------------------
//   protect - Checks if user is logged in (has valid JWT)
// -----------------------------------------------
const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the request header as: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token part (after "Bearer ")
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({ message: "Not authorized. Please login." });
  }

  try {
    // Verify the token using our JWT_SECRET from .env
    // If valid, decoded will contain the user's id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the id from the token
    // .select("-password") means: get everything EXCEPT the password field
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Pass control to the next function (the actual route handler)
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// -----------------------------------------------
//   authorizeRoles - Checks if user has required role
//   Usage: authorizeRoles("admin") or authorizeRoles("doctor", "admin")
// -----------------------------------------------
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the logged-in user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${roles.join(", ")} can perform this action.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
