const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  examID: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctOptions: { type: [Number], required: true },
});

module.exports = mongoose.model("Question", questionSchema);
