const express = require("express");
const Exam = require("../models/Exam");
const Result = require("../models/result");
const authenticateToken = require("../middleware/auth");

const router = express.Router();


router.post("/submit-exam", authenticateToken, async (req, res) => {
  try {
    const { studentID, examID, responses, timeTaken } = req.body;

    const exam = await Exam.findById(examID).populate("questions");
    let score = 0;
    exam.questions.forEach((question, index) => {
      if (
        JSON.stringify(question.correctOptions) ===
        JSON.stringify(responses[index].correctOptions)
      ) {
        score += 1;
      }
    });

    const result = new Result({
      studentID,
      examID,
      responses,
      score,
      timeTaken,
    });
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error submitting exam:", error.message);
    res.status(500).json({ message: "Error submitting exam" });
  }
});



module.exports = router;
