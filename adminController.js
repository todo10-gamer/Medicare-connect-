// =============================================
//   controllers/adminController.js
// =============================================

const User        = require("../models/User");
const Doctor      = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// -----------------------------------------------
//   @route   GET /api/admin/dashboard
//   @desc    Get overall system stats
//   @access  Private - Admin only
// -----------------------------------------------
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers        = await User.countDocuments({ role: "patient" });
    const totalDoctors      = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();
    const pendingDoctors    = await Doctor.countDocuments({ isApproved: false });

    const pendingAppointments   = await Appointment.countDocuments({ status: "pending" });
    const confirmedAppointments = await Appointment.countDocuments({ status: "confirmed" });
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });
    const cancelledAppointments = await Appointment.countDocuments({ status: "cancelled" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        pendingDoctors,
        appointments: {
          pending:   pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
        },
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   GET /api/admin/users
//   @desc    Get all registered users
//   @access  Private - Admin only
// -----------------------------------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   GET /api/admin/appointments
//   @desc    Get all appointments in the system
//   @access  Private - Admin only
// -----------------------------------------------
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor",  "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   PUT /api/admin/approve-doctor/:id
//   @desc    Admin approves a doctor's profile
//   @access  Private - Admin only
// -----------------------------------------------
const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    doctor.isApproved = true;
    await doctor.save();

    res.status(200).json({ success: true, message: "Doctor approved successfully!" });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   DELETE /api/admin/users/:id
//   @desc    Delete a user account
//   @access  Private - Admin only
// -----------------------------------------------
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "User deleted successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   POST /api/admin/fix-doctors
//   @desc    Creates missing Doctor profiles for
//            all users with role="doctor" who
//            don't have a Doctor profile yet.
//            Run this ONCE to fix existing accounts.
//   @access  Private - Admin only
// -----------------------------------------------
const fixDoctorProfiles = async (req, res) => {
  try {
    // Find all users with role doctor
    const doctorUsers = await User.find({ role: "doctor" });
    let created = 0;

    for (const user of doctorUsers) {
      // Check if a Doctor profile already exists for this user
      const existing = await Doctor.findOne({ user: user._id });

      if (!existing) {
        // Create a basic profile for this doctor
        await Doctor.create({
          user:           user._id,
          specialization: "General Physician",
          experience:     0,
          fees:           500,
          bio:            "",
          isApproved:     true, // Auto-approve
        });
        created++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Fixed! Created ${created} missing doctor profile(s).`,
      total:   doctorUsers.length,
      created,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllAppointments,
  approveDoctor,
  deleteUser,
  fixDoctorProfiles,
};
