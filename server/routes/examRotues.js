const express = require("express");
const examController = require("../controllers/examController");
const resultController = require("../controllers/resultController");
const { verifyToken } = require("../middleware/auth");


const router = express.Router();

router.post("/create", examController.createExam);

//router.get("/:examId/questions", examController.getQuestionsForExam);
router.get("/instructor/:instructorId", examController.getExamsByInstructor);
router.post('/:examId/questions', examController.addQuestions);
router.get("/:examId/get", examController.getExamById);
router.get("/:examId/questions/get", examController.getQuestionsForExam);


    
// Get exams for a student
router.get("/get-exams", examController.getStudentExams);

// Get questions for an exam
router.get("/:examId/questions/get", examController.getExamQuestions);

// Submit exam responses
router.post("/:examId/submit", resultController.submitExam);


// Route to get all exams with results
router.get('/results', resultController.getExamsWithResults);

router.get("/:examId/results", resultController.getResultsByExamId);


module.exports = router;
