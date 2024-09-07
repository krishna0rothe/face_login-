// ExamList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ExamList.css";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/exams/instructor/668b947cab8a4c102ffb0b7a"
        );
        setExams(response.data.exams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  const showDetails = (exam) => {
    setSelectedExam(exam);
  };

  const closeDetails = () => {
    setSelectedExam(null);
  };

  const goToCreateExam = () => {
    navigate("/create-exam");
  };

  const goToAddQuestions = (examId) => {
    navigate(`/add-questions/${examId}`);
  };

  const goToViewQuestions = (examId) => {
    navigate(`/view-questions/${examId}`);
  };

  return (
    <div className="exam-list">
      <h2>Your Exams</h2>
      <button className="create-exam-button" onClick={goToCreateExam}>
        Create Exam
      </button>
      {selectedExam ? (
        <div className="exam-details">
          <h3>{selectedExam.title}</h3>
          <p>Start Time: {new Date(selectedExam.startTime).toLocaleString()}</p>
          <p>End Time: {new Date(selectedExam.endTime).toLocaleString()}</p>
          <p>Duration: {selectedExam.duration} minutes</p>
          <p>Total Marks: {selectedExam.totalMarks}</p>
          <p>Number of Questions: {selectedExam.numQuestions}</p>
          <button onClick={closeDetails}>Close</button>
        </div>
      ) : (
        <ul>
          {exams.map((exam) => (
            <li key={exam._id}>
              <div className="exam-summary">
                <div className="exam-info">
                  <h3>{exam.title}</h3>
                  <p>
                    Start Date: {new Date(exam.startTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="exam-buttons">
                  <button onClick={() => showDetails(exam)}>Show Details</button>
                  <button onClick={() => goToAddQuestions(exam._id)}>
                    Add Questions
                  </button>
                  <button onClick={() => goToViewQuestions(exam._id)}>
                    View Questions
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExamList;
