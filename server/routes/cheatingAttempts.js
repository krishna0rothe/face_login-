const authenticateJWT = require("../middleware/authenticateJWT"); // Adjust path as per your project structure
const router = require("./instructor");

const cheatingAttemptsController = require("../controllers/cheatingAttemptsController");

// Get exams with cheating attempts
router.get("/exams-with-cheating-attempts", cheatingAttemptsController.getExamsWithCheatingAttempts);

// Get cheating attempts for a specific exam
router.get("/:examID", cheatingAttemptsController.getCheatingAttemptsByExam);



module.exports = router;
