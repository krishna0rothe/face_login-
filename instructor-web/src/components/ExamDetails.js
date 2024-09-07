import React, { useState } from "react";
import AddQuestionForm from "./AddQuestionForm";
import "../styles/ExamDetails.css";

const ExamDetails = ({ exam }) => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  return (
    <div className="exam-details">
      <h2>Exam Details</h2>
      <p>Title: {exam.title}</p>
      <p>Start Time: {new Date(exam.startTime).toLocaleString()}</p>
      <p>End Time: {new Date(exam.endTime).toLocaleString()}</p>
      <p>Duration: {exam.duration} minutes</p>
      <p>Total Marks: {exam.totalMarks}</p>
      <p>Number of Questions: {exam.numQuestions}</p>
      <button onClick={toggleForm}>Add Question</button>
      {showForm && <AddQuestionForm examId={exam._id} />}
    </div>
  );
};

export default ExamDetails;
