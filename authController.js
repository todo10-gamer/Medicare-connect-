// =============================================
//   controllers/authController.js
//   Handles: Register, Login, Get Profile
// =============================================

const User   = require("../models/User");
const Doctor = require("../models/Doctor");
const jwt    = require("jsonwebtoken");

// -----------------------------------------------
//   Helper: Generate JWT Token
// -----------------------------------------------
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// -----------------------------------------------
//   @route   POST /api/auth/register
//   @desc    Create a new user account
//   @access  Public
// -----------------------------------------------
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Create the user
    // Password is auto-hashed by the pre-save hook in User.js
    const user = await User.create({
      name,
      email,
      password,
      role:  role  || "patient",
      phone: phone || "",
    });

    // -----------------------------------------------
    //   AUTO-CREATE DOCTOR PROFILE
    //   If the user registered as a doctor,
    //   we automatically create a basic Doctor
    //   profile so they appear in the doctors list.
    //   isApproved is set to TRUE so patients can
    //   find them immediately (admin can change later)
    // -----------------------------------------------
    if (user.role === "doctor") {
      await Doctor.create({
        user:           user._id,
        specialization: "General Physician", // Default — doctor can update in profile
        experience:     0,
        fees:           500,
        bio:            "",
        isApproved:     true, // Auto-approved for demo purposes
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// -----------------------------------------------
//   @route   POST /api/auth/login
//   @desc    Login and return JWT token
//   @access  Public
// -----------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated. Contact admin." });
    }

    // Compare entered password with hashed password in DB
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// -----------------------------------------------
//   @route   GET /api/auth/me
//   @desc    Get currently logged-in user's info
//   @access  Private
// -----------------------------------------------
const getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { register, login, getMe };
