const mongoose = require("mongoose");

const cheatingAttemptSchema = new mongoose.Schema({
  studentID: { type: String, required: true },
  examID: { type: String, default: "3333" }, // Default exam ID
  type: { type: String, required: true }, // Type of cheating (e.g., "Phone Detected")
  screenshot: { type: Buffer, required: true }, // Encoded screenshot
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CheatingAttempt", cheatingAttemptSchema);
