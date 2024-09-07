const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Adjust path as per your project structure
const CheatingAttempt = require("./models/CheatingAttempt");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");




const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Static files
app.use(express.static(path.join(__dirname, "uploads")));

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/exam_proctoring", {

});

const instructorRoutes = require("./routes/instructor");
app.use("/instructor", instructorRoutes);

const cheatingAttemptsRoutes = require("./routes/cheatingAttempts");
app.use("/api/get/cheating-attempts", cheatingAttemptsRoutes);


const examRoutes = require("./routes/examRotues");
app.use("/api/exams", examRoutes);

const accessRoutes = require("./routes/accessRoutes");
app.use("/api/access", accessRoutes);


// JWT secret key   
const jwtSecretKey = "krishna"; // Replace with your actual secret key

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/" });
const uploadMemory = multer({ storage: multer.memoryStorage() });


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

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    const studentID = decoded.studentID;

    if (!studentID || !req.file) {
      return res
        .status(400)
        .json({ message: "Student ID and photo are required" });
    }

    const user = await User.findOne({ studentID });

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    const storedPhotoPath = path.join(__dirname, user.photo);
    console.log("Stored photo path:", storedPhotoPath);

    if (!fs.existsSync(storedPhotoPath)) {
      return res.status(404).json({ message: "Stored photo not found" });
    }

    // Create FormData object and ensure the file extensions are .jpeg
    const formData = new FormData();
    formData.append("uploadedPhoto", fs.createReadStream(req.file.path), {
      filename: "uploaded_photo.jpeg",
      contentType: "image/jpeg",
    });
    formData.append("storedPhoto", fs.createReadStream(storedPhotoPath), {
      filename: "stored_photo.jpeg",
      contentType: "image/jpeg",
    });

    // Log form data structure
    formData.getLength((err, length) => {
      if (err) {
        console.error("Error getting form data length:", err);
      } else {
        console.log("Form data length:", length);
      }
    });

    // Send POST request to Python server using axios
    const axiosConfig = {
      headers: {
        ...formData.getHeaders(),
      },
    };

    const pythonResponse = await axios.post(
      "http://localhost:8080/verify",
      formData,
      axiosConfig
    );

    console.log("Python server response:", pythonResponse.data);

    res.json(pythonResponse.data);
  } catch (error) {
    console.error("Error during verification:", error.message);
    res.status(500).json({ message: "Error during verification" });
  }
});

app.post(
  "/cheating-attempts/store",
  uploadMemory.single("screenshot"),
  async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtSecretKey);
      const studentID = decoded.studentID;
      console.log("Student ID from token:", studentID);

      if (!studentID) {
        return res
          .status(400)
          .json({ message: "Student ID not found in token" });
      }
      console.log("Request body:", req.body);
      console.log("Request data:", req.data);
      const { examID, type } = req.body;
      const screenshot = req.file; // Multer's memory storage returns the file as a buffer

      if (!screenshot) {
        return res.status(400).json({ message: "Screenshot is required" });
      }

      // Save cheating attempt to database
      const newCheatingAttempt = new CheatingAttempt({
        studentID,
        examID,
        type,
        screenshot: screenshot.buffer, // Store the buffer directly
      });

      await newCheatingAttempt.save();

      res.status(201).json({ message: "Cheating attempt logged successfully" });
    } catch (error) {
      console.error("Error storing cheating attempt:", error.message);
      res.status(500).json({ message: "Error storing cheating attempt" });
    }
  }
);




// Serve instructor signup and login pages
app.get("/instructor/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "instructor_signup.html"));
});

app.get("/instructor/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "instructor_login.html"));
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
