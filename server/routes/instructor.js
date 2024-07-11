  const express = require("express");
  const router = express.Router();
  const Instructor = require("../models/Instructor");
  const jwt = require("jsonwebtoken");
  const authenticateJWT = require("../middleware/authenticateJWT");

  const jwtSecretKey = "krishna"; // Replace with your actual secret key

 // Instructor Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("Instructor signup request:", req.body);

    const {
      email,
      name,
      contactNumber,
      schoolOrganization,
      subjectRole,
      password,
    } = req.body;

    // Check if instructor already exists
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(400).json({ message: "Instructor already exists" });
    }

    // Create new instructor
    const newInstructor = new Instructor({
      email,
      name,
      contactNumber,
      schoolOrganization,
      subjectRole,
      password,
    });

    await newInstructor.save();

    res.status(201).json({ message: "Instructor registered successfully" });
  } catch (error) {
    console.error("Error during instructor signup:", error.message);
    res.status(500).json({ message: "Error during instructor signup" });
  }
});


// Instructor Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if instructor exists
    const instructor = await Instructor.findOne({ email });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: instructor.email }, 'your_jwt_secret_key', { expiresIn: '1h' });

    res.cookie('jwtToken', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: false, // Set to true if using https
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during instructor login:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
