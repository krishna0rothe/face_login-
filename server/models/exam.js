const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  organization: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exam", examSchema);
