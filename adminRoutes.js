// =============================================
//   routes/adminRoutes.js
// =============================================

const express = require("express");
const router  = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  getAllUsers,
  getAllAppointments,
  approveDoctor,
  deleteUser,
  getDashboardStats,
  fixDoctorProfiles,
} = require("../controllers/adminController");

// GET  /api/admin/dashboard        → System stats
router.get("/dashboard", protect, authorizeRoles("admin"), getDashboardStats);

// GET  /api/admin/users            → All users
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// GET  /api/admin/appointments     → All appointments
router.get("/appointments", protect, authorizeRoles("admin"), getAllAppointments);

// PUT  /api/admin/approve-doctor/:id → Approve a doctor
router.put("/approve-doctor/:id", protect, authorizeRoles("admin"), approveDoctor);

// DELETE /api/admin/users/:id      → Delete a user
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

// POST /api/admin/fix-doctors      → Fix missing doctor profiles (run once)
router.post("/fix-doctors", protect, authorizeRoles("admin"), fixDoctorProfiles);

module.exports = router;
