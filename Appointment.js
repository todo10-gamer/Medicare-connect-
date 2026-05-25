// =============================================
//   models/Appointment.js - Appointment Schema
// =============================================

// This stores every appointment booked in the system.

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Which patient booked this appointment?
    // References the User model
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which doctor is the appointment with?
    // References the User model (the doctor's account)
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Date of the appointment (stored as a JavaScript Date object)
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },

    // Time slot - e.g. "10:00 AM"
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
    },

    // Status of the appointment
    // pending  → Patient booked, waiting for doctor confirmation
    // confirmed → Doctor confirmed the appointment
    // completed → Appointment is done
    // cancelled → Either patient or doctor cancelled
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    // Problem or symptoms described by the patient
    problem: {
      type: String,
      default: "",
    },

    // Doctor's notes or prescription after the appointment
    prescription: {
      type: String,
      default: "",
    },

    // Reason for cancellation (if cancelled)
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // createdAt and updatedAt added automatically
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
