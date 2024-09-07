  const express = require("express");
  const router = express.Router();
  const Instructor = require("../models/Instructor");
  const jwt = require("jsonwebtoken");
  const authenticateJWT = require("../middleware/auth");

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
  const instructor = await Instructor.findOne({ email, password });

  if (instructor) {
    // Generate JWT token
    const token = jwt.sign({ email }, jwtSecretKey, { expiresIn: "1h" });
    // Set token in cookies or send it in response
    res.cookie("jwtToken", token, {
      httpOnly: true,
      sameSite: "None", // Ensure cookie is sent with cross-site requests
      secure: false, // Set to true if you're using https
    });

    console.log("Login successful. Token generated:", token);
    res.send({ token }); // Send the token as an object
  } else {
    res.status(401).send("Invalid student ID or password");
  }
});




module.exports = router;
