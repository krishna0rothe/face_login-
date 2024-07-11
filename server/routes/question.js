const express = require("express");
const Question = require("../models/question");
const Exam = require("../models/Exam");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/add-question", authenticateToken, async (req, res) => {
  try {
    const { examID, questionText, options, correctOptions } = req.body;
    const newQuestion = new Question({
      examID,
      questionText,
      options,
      correctOptions,
    });
    await newQuestion.save();

    await Exam.findByIdAndUpdate(examID, {
      $push: { questions: newQuestion._id },
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error adding question:", error.message);
    res.status(500).json({ message: "Error adding question" });
  }
});

module.exports = router;
