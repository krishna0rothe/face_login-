// ViewQuestions.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ViewQuestions.css";

const ViewQuestions = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionsAdded, setQuestionsAdded] = useState(0);
  const [examTitle, setExamTitle] = useState(""); // State for exam title
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/exams/${examId}/questions/get`
        );
        console.log("Data", response.data);

        // Set the state with data from the response
        setQuestions(response.data.questions);
        setTotalQuestions(response.data.totalQuestions);
        setQuestionsAdded(response.data.questionsAdded);
        setExamTitle(response.data.examTitle); // Set the exam title
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [examId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-questions">
      {/* Display the exam title instead of ID */}
      <h2>Questions for Exam: {examTitle}</h2>
      <p>
        {questionsAdded} out of {totalQuestions} questions added.{" "}
        {totalQuestions - questionsAdded} questions left to add.
      </p>
      <ul>
        {questions.map((question, index) => (
          <li key={question._id} className="question-item">
            <h3>
              Question {index + 1}: {question.questionText}
            </h3>
            <ul className="options-list">
              {question.options.map((option, idx) => (
                <li
                  key={idx}
                  className={`option-item ${option.isCorrect ? "correct" : ""}`}
                >
                  {option.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewQuestions;
