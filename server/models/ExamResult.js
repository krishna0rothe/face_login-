const mongoose = require("mongoose");

const examResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  correctAnswers: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  dateTaken: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExamResult", examResultSchema);
