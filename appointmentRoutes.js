// =============================================
//   routes/appointmentRoutes.js
// =============================================

const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");

// POST /api/appointments/book → Patient books an appointment
router.post("/book", protect, authorizeRoles("patient"), bookAppointment);

// GET /api/appointments/my → Get appointments for logged-in user (patient or doctor)
router.get("/my", protect, getMyAppointments);

// PUT /api/appointments/:id/status → Doctor updates appointment status
router.put("/:id/status", protect, authorizeRoles("doctor", "admin"), updateAppointmentStatus);

// PUT /api/appointments/:id/cancel → Patient or doctor cancels appointment
router.put("/:id/cancel", protect, cancelAppointment);

module.exports = router;
