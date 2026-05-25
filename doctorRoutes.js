// =============================================
//   routes/doctorRoutes.js
// =============================================

const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
} = require("../controllers/doctorController");

// GET /api/doctors → Public: Get all approved doctors (for patient search)
router.get("/", getAllDoctors);

// GET /api/doctors/:id → Public: Get one doctor's details
router.get("/:id", getDoctorById);

// PUT /api/doctors/profile → Doctor updates their own profile
router.put("/profile", protect, authorizeRoles("doctor"), updateDoctorProfile);

module.exports = router;
