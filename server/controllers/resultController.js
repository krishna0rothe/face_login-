const mongoose = require("mongoose");
const User = require("../models/User"); // Import the User model
const StudentResponse = require("../models/StudentResponse");
const Exam = require("../models/Exam");
const ExamResult = require("../models/ExamResult");

exports.submitExam = async (req, res) => {
  try {
    const { examId, responses } = req.body;
    const studentId = req.header("studentId"); // Assuming studentId is obtained from the JWT token or request header
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is missing." });
    }

    // Convert studentId to ObjectId
    const student = await User.findOne({ studentID: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    console.log("student =>", student); 
    const studentObjectId = student._id;
    console.log("studentObjectId =>", studentObjectId);
    // Save student responses
    const studentResponses = new StudentResponse({
      student: studentObjectId,
      exam: examId,
      responses,
    });
    console.log("Storing student responses");
    await studentResponses.save();


    // Calculate result immediately after saving responses
    const exam = await Exam.findById(examId).populate("questions");
    console.log("exam =>", exam);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    let correctAnswers = 0;

    // Iterate through the student's responses
    responses.forEach((response) => {
      const question = exam.questions.find(
        (q) => q._id.toString() === response.question.toString()
      );

      if (question) {
        // Find the correct option
        const correctOption = question.options.find(
          (option) => option.isCorrect
        );

        // Check if the student's selected option is correct
        if (correctOption && correctOption.text === response.selectedOption) {
          correctAnswers++;
        }
      }
    });

    const totalMarks = correctAnswers * exam.marksPerQuestion;
    const percentage = (totalMarks / exam.totalMarks) * 100;

    // Save the exam result
    const result = new ExamResult({
      student: studentObjectId,
      exam: examId,
      correctAnswers,
      totalMarks,
      percentage,
    });

    await result.save();

    res.json({
      message: "Exam submitted and result calculated successfully.",
      correctAnswers,
      totalMarks,
      percentage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting exam responses.", error });
  }
};

// Fetch exams with results
exports.getExamsWithResults = async (req, res) => {
  try {
    

    // Find all ExamResults and populate related Exam and User data
    const examsWithResults = await ExamResult.find()
      .populate("exam", "title startTime endTime totalMarks") // Populate specific fields from Exam
      .populate("student", "name studentID") // Populate specific fields from User
      .sort({ dateTaken: -1 }); // Sort by most recent 

    if (examsWithResults.length === 0) {
      return res.status(404).json({ message: "No exams with results found" });
    }

    // Group results by exam
    const groupedResults = examsWithResults.reduce((acc, result) => {
      const examId = result.exam._id.toString();

      if (!acc[examId]) {
        acc[examId] = {
          exam: result.exam,
          results: [],
        };
      }

      acc[examId].results.push({
        student: result.student,
        correctAnswers: result.correctAnswers,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        dateTaken: result.dateTaken,
      });

      return acc;
    }, {});

    res.json(Object.values(groupedResults));
  } catch (error) {
    console.error("Error fetching exams with results:", error);
    res.status(500).json({ message: "Error fetching exams with results", error });
  }
};


// Fetch results for a specific exam
exports.getResultsByExamId = async (req, res) => {
  const { examId } = req.params;

  try {
    const examResults = await ExamResult.find({ exam: examId })
      .populate("student", "name email")
      .populate("exam", "title totalMarks");

    if (!examResults.length) {
      return res.status(404).json({ message: "No results found for this exam" });
    }

    res.json({
      exam: {
        title: examResults[0].exam.title,
        totalMarks: examResults[0].exam.totalMarks,
      },
      results: examResults.map(result => ({
        student: result.student,
        correctAnswers: result.correctAnswers,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        dateTaken: result.dateTaken,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam results", error });
  }
};
