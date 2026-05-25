// =============================================
//   controllers/doctorController.js
// =============================================

const User   = require("../models/User");
const Doctor = require("../models/Doctor");

// -----------------------------------------------
//   @route   GET /api/doctors
//   @desc    Get all approved doctors
//   @access  Public
// -----------------------------------------------
const getAllDoctors = async (req, res) => {
  try {
    // Find all approved doctor profiles
    // populate("user") replaces the user ID with actual user data
    const doctors = await Doctor.find({ isApproved: true })
      .populate("user", "name email phone profilePhoto");

    res.status(200).json({ success: true, doctors });

  } catch (error) {
    console.error("Get doctors error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   GET /api/doctors/:id
//   @desc    Get single doctor details
//   @access  Public
// -----------------------------------------------
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "name email phone profilePhoto");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    res.status(200).json({ success: true, doctor });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   PUT /api/doctors/profile
//   @desc    Doctor updates their own profile
//   @access  Private - Doctor only
// -----------------------------------------------
const updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, experience, fees, bio, availability } = req.body;

    // Find the doctor profile linked to this user account
    let doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      // If no profile exists yet, create one
      // This handles doctors registered before the auto-create fix
      doctor = await Doctor.create({
        user: req.user._id,
        specialization: specialization || "General Physician",
        experience:     experience     || 0,
        fees:           fees           || 500,
        bio:            bio            || "",
        availability:   availability   || [],
        isApproved:     true, // Auto-approve for development
      });
    } else {
      // Update the existing profile fields
      if (specialization) doctor.specialization = specialization;
      if (experience)     doctor.experience     = experience;
      if (fees)           doctor.fees           = fees;
      if (bio)            doctor.bio            = bio;
      if (availability)   doctor.availability   = availability;
      await doctor.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      doctor,
    });

  } catch (error) {
    console.error("Update doctor profile error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getAllDoctors, getDoctorById, updateDoctorProfile };
