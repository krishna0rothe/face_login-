const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Exam = require("../models/Exam");
const crypto = require("crypto");

// Endpoint to get all students
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({}); // Adjust the query if needed
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Assign an exam to specific students
router.post('/assign-exam/:examId', async (req, res) => {
  const { examId } = req.params;
  const { studentIds } = req.body;

  try {
    // Find the exam and update its allowedStudents
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Validate student IDs
    const students = await User.find({ '_id': { $in: studentIds } });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: 'Some students not found' });
    }

    // Update exam with allowed students
    exam.allowedStudents = studentIds;
    await exam.save();

    res.status(200).json({ message: 'Exam assigned successfully', exam });
  } catch (error) {
    console.error('Error assigning exam:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});


// Endpoint to fetch accessible exams for a student
router.get("/student-exams", async (req, res) => {
  const { studentID } = req.query; // Assume studentID is passed in the query

  try {
    const student = await User.findOne({ studentID }).populate("accessibleExams.examID");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student.accessibleExams);
  } catch (error) {
    console.error("Error fetching student exams:", error);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
});

// Endpoint to verify access code
router.post("/verify-access-code", async (req, res) => {
  const { studentID, examID, accessCode } = req.body;

  try {
    const student = await User.findOne({
      studentID,
      "accessibleExams.examID": examID,
      "accessibleExams.accessCode": accessCode,
    });

    if (!student) {
      return res.status(401).json({ error: "Invalid access code" });
    }

    res.status(200).json({ message: "Access code verified successfully" });
  } catch (error) {
    console.error("Error verifying access code:", error);
    res.status(500).json({ error: "Failed to verify access code" });
  }
});

module.exports = router;
