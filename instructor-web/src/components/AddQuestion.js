import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useParams } from "react-router-dom";
import "../styles/AddQuestions.css"; // Add this line to import the new CSS

const AddQuestions = () => {
  const { examId } = useParams(); // Get the exam ID from the URL
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOptions: [] },
  ]);
  const [examDetails, setExamDetails] = useState(null);
  const [remainingQuestions, setRemainingQuestions] = useState(0);

  const fetchExamDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/exams/${examId}/get`
      );
      console.log(response.data); // Log to verify response structure
      setExamDetails(response.data);
      setRemainingQuestions(
        Math.max(0, response.data.numQuestions - response.data.questions.length)
      );
    } catch (error) {
      console.error("Error fetching exam details:", error);
    }
  };

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "questionText") {
      newQuestions[index].questionText = value;
    } else if (field === "option") {
      newQuestions[index].options = value;
    } else if (field === "correctOption") {
      const currentCorrectOptions = newQuestions[index].correctOptions;
      if (currentCorrectOptions.includes(value)) {
        newQuestions[index].correctOptions = currentCorrectOptions.filter(
          (opt) => opt !== value
        );
      } else {
        newQuestions[index].correctOptions.push(value);
      }
    }
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctOptions: [] },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length > remainingQuestions) {
      alert(`Cannot add more than ${remainingQuestions} questions`);
      return;
    }

    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      options: q.options.map((opt, index) => ({
        text: opt,
        isCorrect: q.correctOptions.includes(index),
      })),
    }));

    try {
      await axios.post(`http://localhost:5000/api/exams/${examId}/questions`, {
        questions: formattedQuestions,
      });
      alert("Questions added successfully");
      setQuestions([
        { questionText: "", options: ["", "", "", ""], correctOptions: [] },
      ]);
      fetchExamDetails(); // Refresh details after adding questions
    } catch (error) {
      console.error("Error adding questions:", error);
      alert("Failed to add questions");
    }
  };

  return (
    <div className="add-questions">
      <h2>Add Questions to Exam: {examDetails?.title}</h2>
      <p>Remaining Questions: {remainingQuestions}</p>
      <form onSubmit={handleSubmit}>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <div className="form-group">
              <label>Question {qIndex + 1}:</label>
              <input
                type="text"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "questionText", e.target.value)
                }
                required
              />
            </div>
            <div className="options">
              {q.options.map((option, index) => (
                <div key={index} className="form-group">
                  <label>Option {index + 1}:</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...q.options];
                      newOptions[index] = e.target.value;
                      handleQuestionChange(qIndex, "option", newOptions);
                    }}
                    required
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={q.correctOptions.includes(index)}
                      onChange={() =>
                        handleQuestionChange(qIndex, "correctOption", index)
                      }
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="button-group">
          <button
            type="button"
            onClick={addNewQuestion}
            className="btn add-btn"
          >
            Add Another Question
          </button>
          <button type="submit" className="btn submit-btn">
            Submit Questions
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestions;
