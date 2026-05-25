// =============================================
//   models/Doctor.js - Doctor Profile Schema
// =============================================

// A Doctor document stores extra info about users who are doctors.
// It is LINKED to the User model via the "user" field (reference).

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // Link to the User document (the doctor's login account)
    // "ref: 'User'" means this ID points to a document in the "users" collection
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One doctor profile per user account
    },

    // Medical specialization (e.g. "Cardiologist", "Dentist")
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },

    // Years of experience
    experience: {
      type: Number,
      default: 0,
    },

    // Fees per appointment (in rupees)
    fees: {
      type: Number,
      default: 500,
    },

    // Available timings - array of objects
    // Example: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }]
    availability: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],

    // Short biography / description shown to patients
    bio: {
      type: String,
      default: "",
    },

    // Average rating given by patients (1 to 5)
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Total number of ratings received (used to calculate average)
    totalRatings: {
      type: Number,
      default: 0,
    },

    // Is this doctor profile approved by admin?
    isApproved: {
      type: Boolean,
      default: false, // Admin must approve before doctor shows up in search
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
