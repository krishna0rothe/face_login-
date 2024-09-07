const CheatingAttempt = require("../models/CheatingAttempt");
const Exam = require("../models/Exam");

exports.getExamsWithCheatingAttempts = async (req, res) => {
  try {
    // Aggregate cheating attempts by exam ID
    const attempts = await CheatingAttempt.aggregate([
      {
        $group: {
          _id: "$examID",
          count: { $sum: 1 }, // Count the number of cheating attempts for each exam
        },
      },
    ]);

    // Find exams that have cheating attempts
    const exams = await Exam.find({ _id: { $in: attempts.map((a) => a._id) } });

    // Map exams to include cheating attempts count
    const examsWithCheatingAttempts = exams.map((exam) => {
      // Find corresponding attempt count
      const attempt = attempts.find((a) => String(a._id) === String(exam._id));
      return {
        examID: exam._id,
        title: exam.title,
        startTime: exam.startTime,
        cheatingAttemptsCount: attempt ? attempt.count : 0,
      };
    });

    res.json(examsWithCheatingAttempts);
  } catch (error) {
    console.error("Error fetching exams with cheating attempts:", error);
    res
      .status(500)
      .json({ message: "Error fetching exams with cheating attempts" });
  }
};


exports.getCheatingAttemptsByExam = async (req, res) => {
  const { examID } = req.params;

  try {
    const attempts = await CheatingAttempt.find({ examID })
      .populate("examID", "title startTime") // Populate exam details if needed
      .exec();

    res.json(attempts);
  } catch (error) {
    console.error("Error fetching cheating attempts for exam:", error);
    res
      .status(500)
      .json({ message: "Error fetching cheating attempts for exam" });
  }
};

