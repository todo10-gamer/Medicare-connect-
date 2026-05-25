// =============================================
//   controllers/userController.js
//   General user profile update for ALL roles
//   (patient, doctor, admin)
// =============================================

const User = require("../models/User");

// -----------------------------------------------
//   @route   GET /api/users/profile
//   @desc    Get logged-in user's profile
//   @access  Private - Any logged in user
// -----------------------------------------------
const getProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// -----------------------------------------------
//   @route   PUT /api/users/profile
//   @desc    Update logged-in user's profile
//   @access  Private - Any logged in user
// -----------------------------------------------
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
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

// -----------------------------------------------
//   @route   PUT /api/users/change-password
//   @desc    Change logged-in user's password
//   @access  Private - Any logged in user
// -----------------------------------------------
const changePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Find the user (need the full document to trigger pre-save hook)
    const user = await User.findById(req.user._id);

    // Set the new password — bcrypt hashing happens automatically
    // via the pre-save middleware in User.js
    user.password = password;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully!" });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
