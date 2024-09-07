// ExamsWithCheatingAttempts.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CheatingAttempts.css"; // Import your CSS file

const ExamsWithCheatingAttempts = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [cheatingAttempts, setCheatingAttempts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExamsWithCheatingAttempts();
  }, []);

  const fetchExamsWithCheatingAttempts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/get/cheating-attempts/exams-with-cheating-attempts"
      );
      setExams(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch exams with cheating attempts");
      console.error("Error fetching exams:", error);
    }
  };

  const fetchCheatingAttempts = async (examID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/get/cheating-attempts/${examID}`
      );
      setCheatingAttempts(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch cheating attempts");
      console.error("Error fetching cheating attempts:", error);
    }
  };

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    fetchCheatingAttempts(exam.examID);
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div className="container exams-with-cheating-attempts">
      <h1 className="page-title">Exams with Cheating Attempts</h1>
      {error && <p className="error">{error}</p>}
      {exams.length > 0 ? (
        <ul className="exam-list">
          {exams.map((exam, index) => (
            <li
              key={index}
              className="exam-item"
              onClick={() => handleExamClick(exam)}
            >
              <strong>{exam.title}</strong>
              <span>({exam.cheatingAttemptsCount} attempts)</span>
              <span>
                Start Time: {new Date(exam.startTime).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No exams with cheating attempts found.</p>
      )}

      {selectedExam && cheatingAttempts.length > 0 && (
        <div className="cheating-attempts-details">
          <h2>Cheating Attempts for {selectedExam.title}</h2>
          <div className="cards-container">
            {cheatingAttempts.map((attempt, index) => (
              <div key={index} className="cheating-attempt-card">
                <img
                  src={`data:image/jpeg;base64,${arrayBufferToBase64(
                    attempt.screenshot.data
                  )}`}
                  alt="Cheating Attempt Screenshot"
                  className="screenshot"
                />
                <div className="attempt-details">
                  <p>
                    <strong>Student ID:</strong> {attempt.studentID}
                  </p>
                  <p>
                    <strong>Exam ID:</strong> {attempt.examID}
                  </p>
                  <p>
                    <strong>Type:</strong> {attempt.type}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(attempt.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsWithCheatingAttempts;
