// =============================================
//   config/db.js - MongoDB Connection Setup
//   This file connects our Node.js backend
//   to the MongoDB Atlas cloud database.
// =============================================

// "mongoose" is the library that lets Node.js
// talk to MongoDB. It was installed via npm install.
const mongoose = require("mongoose");

// We define a function called connectDB.
// "async" means it can handle waiting (like waiting
// for MongoDB to respond before continuing).
const connectDB = async () => {

  // "try" means: attempt the code inside.
  // If anything goes wrong, jump to "catch" below.
  try {

    // mongoose.connect() is the main function that
    // actually opens the connection to MongoDB Atlas.
    // It reads the URI from our .env file using
    // process.env.MONGO_URI (dotenv loads it for us).
    const conn = await mongoose.connect(process.env.MONGO_URI, {

      // How many milliseconds to wait before giving up
      // trying to find/reach the MongoDB server.
      // 10000ms = 10 seconds
      serverSelectionTimeoutMS: 10000,

      // How long to wait for a response after connecting.
      // 45000ms = 45 seconds
      socketTimeoutMS: 45000,

      // Forces the connection to use IPv4 instead of IPv6.
      // This fixes the "ECONNREFUSED" error on Windows,
      // because Windows sometimes has trouble resolving
      // MongoDB's address using IPv6 (the default).
      family: 4,

    });

    // If we reach this line, the connection was successful!
    // conn.connection.host shows which server we connected to
    // (e.g. cluster-1.deyuinw.mongodb.net)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {

    // If the connection failed for any reason,
    // this block runs. We print the error message
    // so we can see what went wrong in the terminal.
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // process.exit(1) means: stop the entire Node.js server.
    // We do this because there's no point running the server
    // if it can't talk to the database.
    // (1 = exit with failure, 0 = exit with success)
    process.exit(1);

  }
};

// Export this function so server.js can import
// and call it when the server starts up.
module.exports = connectDB;
