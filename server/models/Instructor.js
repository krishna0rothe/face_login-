const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  schoolOrganization: { type: String, required: true }, // Updated
  subjectRole: { type: String, required: true }, // Updated
});

module.exports = mongoose.model("Instructor", instructorSchema);
