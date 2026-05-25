// =============================================
//   routes/authRoutes.js - Authentication Routes
// =============================================

// Router lets us define routes separately from server.js
const express = require("express");
const router = express.Router();

// Import controller functions (we'll create these next)
const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

// Import middleware to protect routes
const { protect } = require("../middleware/authMiddleware");

// -----------------------------------------------
//   Route Definitions
//   Format: router.METHOD("/path", controllerFunction)
// -----------------------------------------------

// POST /api/auth/register → Create new user account
router.post("/register", register);

// POST /api/auth/login → Login and get JWT token
router.post("/login", login);

// GET /api/auth/me → Get currently logged-in user's profile
// "protect" runs first to verify JWT, then getMe runs
router.get("/me", protect, getMe);

module.exports = router;
