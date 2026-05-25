// =============================================
//   controllers/appointmentController.js
// =============================================

const Appointment = require("../models/Appointment");
const Doctor      = require("../models/Doctor");
const User        = require("../models/User");

// -----------------------------------------------
//   @route   POST /api/appointments/book
//   @desc    Patient books a new appointment
//   @access  Private - Patient only
// -----------------------------------------------
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, problem } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: "Doctor, date, and time slot are required." });
    }

    // -----------------------------------------------
    //   FIX: doctorId could be either:
    //   1. The User._id of the doctor (correct)
    //   2. The Doctor profile _id (what frontend was sending)
    //   We handle both cases below.
    // -----------------------------------------------

    let doctorUserId = doctorId; // Assume it's a User ID first

    // Check if this ID belongs to a User with role "doctor"
    const doctorUser = await User.findById(doctorId);

    if (!doctorUser || doctorUser.role !== "doctor") {
      // Not a User ID — try finding it as a Doctor profile ID
      const doctorProfile = await Doctor.findById(doctorId);

      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor not found." });
      }

      // Use the User ID from the Doctor profile
      doctorUserId = doctorProfile.user;
    }

    // Check if this time slot is already booked for this doctor on this date
    const existingAppointment = await Appointment.findOne({
      doctor:   doctorUserId,
      date:     new Date(date),
      timeSlot,
      status:   { $in: ["pending", "confirmed"] },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked. Please choose another." });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patient:  req.user._id,  // From the JWT middleware
      doctor:   doctorUserId,  // The doctor's User ID
      date:     new Date(date),
      timeSlot,
      problem:  problem || "",
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment,
    });

  } catch (error) {
    console.error("Book appointment error:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// -----------------------------------------------
//   @route   GET /api/appointments/my
//   @desc    Get appointments for the logged-in user
//   @access  Private
// -----------------------------------------------
const getMyAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate("doctor", "name email phone")
        .sort({ date: -1 });

    } else if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctor: req.user._id })
        .populate("patient", "name email phone")
        .sort({ date: -1 });
    }

    res.status(200).json({ success: true, appointments });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   PUT /api/appointments/:id/status
//   @desc    Doctor updates appointment status
//   @access  Private - Doctor/Admin only
// -----------------------------------------------
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, prescription } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (status)       appointment.status       = status;
    if (prescription) appointment.prescription = prescription;
    await appointment.save();

    res.status(200).json({ success: true, message: "Appointment updated.", appointment });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   PUT /api/appointments/:id/cancel
//   @desc    Cancel an appointment
//   @access  Private
// -----------------------------------------------
const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.status             = "cancelled";
    appointment.cancellationReason = reason || "No reason provided";
    await appointment.save();

    res.status(200).json({ success: true, message: "Appointment cancelled.", appointment });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};
