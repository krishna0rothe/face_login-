const authenticateJWT = require("../middleware/authenticateJWT"); // Adjust path as per your project structure
const router = require("./instructor");

// Endpoint to fetch cheating attempts by exam ID or student ID
router.post("/cheating-attempts", authenticateJWT, async (req, res) => {
  try {
    console.log("Cheating attempts request:", req.body);
    const { examID, studentID } = req.body;
    

    // Build the query based on examID or studentID
    let query = {};
    if (examID) {
      query.examID = examID;
    }
    if (studentID) {
      query.studentID = studentID;
    }

    // Fetch cheating attempts based on the query
    const cheatingAttempts = await CheatingAttempt.find(query);

    res.status(200).json(cheatingAttempts);
  } catch (error) {
    console.error("Error fetching cheating attempts:", error);
    res.status(500).json({ message: "Error fetching cheating attempts" });
  }
});

module.exports = router;
