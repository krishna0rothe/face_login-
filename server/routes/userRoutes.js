const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const axios = require("axios");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jwtSecretKey = "krushna";

router.post("/login", async (req, res) => {
  const { studentID, password } = req.body;
  const user = await User.findOne({ studentID, password });

  if (user) {
    res.cookie("studentID", studentID, {
      httpOnly: true,
      sameSite: "None", // Ensure cookie is sent with cross-site requests
      secure: false, // Set to true if you're using https
    });
    console.log("Cookie set: studentID=", studentID);
    res.send("Login successful!");
  } else {
    res.status(401).send("Invalid student ID or password");
  }
});



outer.post("/verify", upload.single("photo"), async (req, res) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecretKey);
    const studentID = decoded.studentID;

    // Get the uploaded photo from the request
    const uploadedPhotoBuffer = req.file?.buffer;

    if (!studentID || !uploadedPhotoBuffer) {
      return res
        .status(400)
        .json({ message: "Student ID and photo are required" });
    }

    // Find the user by student ID
    const user = await User.findOne({ studentID });
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Read the stored photo from the file system
    const storedPhotoPath = path.join(__dirname, "../uploads", user.photo);
    const storedPhotoBuffer = fs.readFileSync(storedPhotoPath);

    // Convert the photo buffers to base64 strings
    const uploadedPhotoBase64 = uploadedPhotoBuffer.toString("base64");
    const storedPhotoBase64 = storedPhotoBuffer.toString("base64");

    // Send a request to the Python server for verification
    const pythonResponse = await axios.post("http://localhost:5000/verify", {
      uploadedPhoto: uploadedPhotoBase64,
      storedPhoto: storedPhotoBase64,
    });

    // Return the verification result from the Python server
    res.json(pythonResponse.data);
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ message: "Error during verification" });
  }
});




module.exports = router;
