const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  studentID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
