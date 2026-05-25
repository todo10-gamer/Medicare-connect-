// =============================================
//   routes/userRoutes.js
//   General routes for ALL logged-in users
//   (patient, doctor, admin)
// =============================================

const express = require("express");
const router  = express.Router();

// protect checks JWT — works for any logged in user regardless of role
const { protect } = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

// GET  /api/users/profile         → Get my profile
router.get("/profile", protect, getProfile);

// PUT  /api/users/profile         → Update my name & phone
router.put("/profile", protect, updateProfile);

// PUT  /api/users/change-password → Change my password
router.put("/change-password", protect, changePassword);

module.exports = router;
