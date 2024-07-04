const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Adjust path as per your project structure
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, "uploads")));

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/exam_proctoring", {

});

// JWT secret key
const jwtSecretKey = "krishna"; // Replace with your actual secret key

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Login route
app.post("/login", async (req, res) => {
  const { studentID, password } = req.body;
  const user = await User.findOne({ studentID, password });

  if (user) {
    // Generate JWT token
    const token = jwt.sign({ studentID }, jwtSecretKey, { expiresIn: "1h" });

    // Set token in cookies or send it in response
    res.cookie("jwtToken", token, {
      httpOnly: true,
      sameSite: "None", // Ensure cookie is sent with cross-site requests
      secure: false, // Set to true if you're using https
    });

    console.log("Login successful. Token generated:", token);
    res.send(token);
  } else {
    res.status(401).send("Invalid student ID or password");
  }
});

const { Blob } = require('buffer'); // Ensure you have buffer module

app.post("/verify", upload.single("photo"), async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header received:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", token);

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    console.log("Token decoded:", decoded);
    const studentID = decoded.studentID;

    const uploadedPhotoBuffer = req.file?.buffer;

    if (!studentID || !uploadedPhotoBuffer) {
      return res
        .status(400)
        .json({ message: "Student ID and photo are required" });
    }

    const user = await User.findOne({ studentID });
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    const storedPhotoPath = path.join(__dirname, "/", user.photo);
    const storedPhotoBuffer = fs.readFileSync(storedPhotoPath);

    console.log("Uploaded photo buffer length:", uploadedPhotoBuffer.length);
    console.log("Stored photo buffer length:", storedPhotoBuffer.length);

    // Convert the photo buffers to base64 strings
    const uploadedPhotoBase64 = uploadedPhotoBuffer.toString("base64");
    const storedPhotoBase64 = storedPhotoBuffer.toString("base64");

    // Send a request to the Python server for verification
    const pythonResponse = await axios.post("http://localhost:5000/verify", {
      uploadedPhoto: uploadedPhotoBase64,
      storedPhoto: storedPhotoBase64,
    });

    console.log("Python server response:", pythonResponse.data);
    res.json(pythonResponse.data);
  } catch (error) {
    console.error(
      "Error during verification with Python server:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Error during verification" });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
