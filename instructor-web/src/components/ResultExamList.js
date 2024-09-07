// src/components/ExamList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import ExamResults from "./ExamResults";
import "../styles/ResultExamList.css";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  useEffect(() => {
    const fetchExamsWithResults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/exams/results"
        );
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExamsWithResults();
  }, []);

  const handleExamClick = (examId) => {
    setSelectedExamId(examId);
  };

  return (
    <div className="exam-list">
      <h1>Exams with Results</h1>
      {exams.length === 0 ? (
        <p>No exams with results available.</p>
      ) : (
        <ul>
          {exams.map((exam) => (
            <li
              key={exam.exam._id}
              onClick={() => handleExamClick(exam.exam._id)}
            >
              <h2>{exam.exam.title}</h2>
              <p>
                Start Time: {new Date(exam.exam.startTime).toLocaleString()}
              </p>
              <p>End Time: {new Date(exam.exam.endTime).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
      {selectedExamId && <ExamResults examId={selectedExamId} />}
    </div>
  );
};

export default ExamList;
