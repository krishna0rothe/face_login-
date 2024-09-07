const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, "krishna", (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token." });
    }

    req.studentId = decoded.studentID; // Store student ID from the token
    console.log("Student ID: ", req.studentId);
    next();
  });
};
