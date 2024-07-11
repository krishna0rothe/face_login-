const express = require("express");
const Exam = require("../models/Exam");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/create-exam", authenticateToken, async (req, res) => {
  try {
    const { subject, duration, organization } = req.body;
    const newExam = new Exam({ subject, duration, organization });
    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    console.error("Error creating exam:", error.message);
    res.status(500).json({ message: "Error creating exam" });
  }
});

module.exports = router;
