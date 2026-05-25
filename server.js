// =============================================
//   MediCare Connect - Main Server File
//   Entry point of the entire backend
// =============================================

// Step 1: Load environment variables from .env file
//         This must be the FIRST line before anything else
require("dotenv").config();

// Step 2: Import required packages
const express = require("express");   // Web framework for Node.js
const cors    = require("cors");      // Allows frontend to talk to backend
const connectDB = require("./config/db"); // Our database connection function

// Step 3: Import all route files
const authRoutes        = require("./routes/authRoutes");
const userRoutes        = require("./routes/userRoutes");        // General - all roles
const patientRoutes     = require("./routes/patientRoutes");
const doctorRoutes      = require("./routes/doctorRoutes");
const adminRoutes       = require("./routes/adminRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

// Step 4: Create the Express app
const app = express();

// Step 5: Connect to MongoDB database
connectDB();

// -----------------------------------------------
//   MIDDLEWARE
// -----------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

// -----------------------------------------------
//   ROUTES
// -----------------------------------------------

// Auth: /api/auth/register, /api/auth/login
app.use("/api/auth", authRoutes);

// Users (any role): /api/users/profile, /api/users/change-password
app.use("/api/users", userRoutes);

// Patient: /api/patients/...
app.use("/api/patients", patientRoutes);

// Doctor: /api/doctors/...
app.use("/api/doctors", doctorRoutes);

// Admin: /api/admin/...
app.use("/api/admin", adminRoutes);

// Appointments: /api/appointments/...
app.use("/api/appointments", appointmentRoutes);

// -----------------------------------------------
//   DEFAULT ROUTE
// -----------------------------------------------
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to MediCare Connect API",
    status:  "Server is running!",
    version: "1.0.0"
  });
});

// -----------------------------------------------
//   START SERVER
// -----------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
