// =============================================
//   controllers/patientController.js
// =============================================

const User = require("../models/User");

// -----------------------------------------------
//   @route   GET /api/patients/profile
//   @desc    Get logged-in patient's profile
//   @access  Private - Patient only
// -----------------------------------------------
const getPatientProfile = async (req, res) => {
  try {
    // req.user is already set by protect middleware
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   PUT /api/patients/profile
//   @desc    Update logged-in patient's profile
//   @access  Private - Patient only
// -----------------------------------------------
const updatePatientProfile = async (req, res) => {
  try {
    const { name, phone, profilePhoto } = req.body;

    // Find user and update their profile fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, profilePhoto },
      { new: true, runValidators: true } // "new: true" returns the updated document
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated!",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getPatientProfile, updatePatientProfile };
