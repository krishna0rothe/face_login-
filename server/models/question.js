const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam", // Reference to the Exam collection
    required: true,
  },
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

module.exports = mongoose.model("Question", questionSchema);
