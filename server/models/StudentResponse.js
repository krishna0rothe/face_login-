const mongoose = require("mongoose");

const studentResponseSchema = new mongoose.Schema({
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
  responses: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: { type: String },
    },
  ],
});

module.exports = mongoose.model("StudentResponse", studentResponseSchema);
