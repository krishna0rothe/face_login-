// src/components/ExamResults.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ExamResults.css";

const ExamResults = ({ examId }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResultsByExamId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/exams/${examId}/results`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching exam results:", error);
      }
    };

    fetchResultsByExamId();
  }, [examId]);

  if (!results) {
    return <p>Loading results...</p>;
  }

  return (
    <div className="exam-results">
      <h2>Results for: {results.exam.title}</h2>
      <p>Total Marks: {results.exam.totalMarks}</p>
      <ul>
        {results.results.map((result, index) => (
          <li key={index}>
            <p>
              <strong>Student:</strong> {result.student.name} (
              {result.student.email})
            </p>
            <p>
              <strong>Correct Answers:</strong> {result.correctAnswers}
            </p>
            <p>
              <strong>Marks Obtained:</strong> {result.totalMarks}
            </p>
            <p>
              <strong>Percentage:</strong> {result.percentage.toFixed(2)}%
            </p>
            <p>
              <strong>Date Taken:</strong>{" "}
              {new Date(result.dateTaken).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamResults;
