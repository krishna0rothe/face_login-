const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  numQuestions: { type: Number, required: true },
  marksPerQuestion: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  type: { type: String, default: "MCQ" },
  organization: { type: String, required: true },
  timePerQuestion: { type: Number, required: true },
  allowedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", // Reference to Question collection
    },
  ],
});

module.exports = mongoose.model("Exam", examSchema);
