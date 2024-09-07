const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  studentID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String, required: true },
  accessibleExams: [
    {
      examID: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
      accessCode: { type: String },
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
