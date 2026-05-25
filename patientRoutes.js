// =============================================
//   routes/patientRoutes.js
// =============================================

const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getPatientProfile, updatePatientProfile } = require("../controllers/patientController");

// GET /api/patients/profile → Get logged-in patient's profile
router.get("/profile", protect, authorizeRoles("patient"), getPatientProfile);

// PUT /api/patients/profile → Update logged-in patient's profile
router.put("/profile", protect, authorizeRoles("patient"), updatePatientProfile);

module.exports = router;
