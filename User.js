// =============================================
//   models/User.js - User Database Schema
// =============================================

// A "Schema" defines the structure/shape of documents in a MongoDB collection
// Think of it like a table design in SQL

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // For hashing passwords securely

// Define the structure of a User document in the database
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Removes extra spaces
    },

    // Email must be unique - no two users can have the same email
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Always stored as lowercase
      trim: true,
    },

    // Password is hashed before saving (never store plain passwords!)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // Role determines what the user can access
    // "patient" = book appointments
    // "doctor"  = manage appointments
    // "admin"   = full access
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"], // Only these 3 values allowed
      default: "patient",                   // New users are patients by default
    },

    // Phone number (optional)
    phone: {
      type: String,
      default: "",
    },

    // Profile photo URL (optional)
    profilePhoto: {
      type: String,
      default: "",
    },

    // Is this account active or blocked by admin?
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically adds "createdAt" and "updatedAt" timestamps
    timestamps: true,
  }
);

// -----------------------------------------------
//   MIDDLEWARE: Hash password BEFORE saving to DB
// -----------------------------------------------
// This runs automatically before every .save() call
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or was changed
  if (!this.isModified("password")) return next();

  // bcrypt.hash(password, saltRounds)
  // saltRounds = 12 means very secure (but slightly slower)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// -----------------------------------------------
//   METHOD: Compare entered password with stored hash
// -----------------------------------------------
// We'll call this during login: user.comparePassword(enteredPassword)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the "User" model from the schema and export it
// MongoDB will create a collection called "users" (lowercase plural)
module.exports = mongoose.model("User", userSchema);
