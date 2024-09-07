import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig"; // Using the axios instance
import "../styles/CreateExam.css"; // Adjust path if needed

const CreateExam = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [duration, setDuration] = useState(""); // Duration in minutes
  const [numQuestions, setNumQuestions] = useState("");
  const [marksPerQuestion, setMarksPerQuestion] = useState("");
  const [type, setType] = useState("MCQ");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({
    totalMarks: 0,
    endTime: "",
    timePerQuestion: 0,
  });

  useEffect(() => {
    // Populate hour and minute dropdowns
    const hours = Array.from({ length: 24 }, (_, i) =>
      i < 10 ? `0${i}` : `${i}`
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
      i < 10 ? `0${i}` : `${i}`
    );
    setStartHour(hours[0]);
    setStartMinute(minutes[0]);
  }, []);

  const calculateValues = () => {
    const durationMinutes = parseInt(duration, 10) || 0;
    const questionsCount = parseInt(numQuestions, 10) || 0;
    const marksCount = parseInt(marksPerQuestion, 10) || 0;
    const totalMarks = questionsCount * marksCount;
    const timePerQuestion = questionsCount
      ? durationMinutes / questionsCount
      : 0;

    // Calculate End Time
    let calculatedEndHour = parseInt(startHour, 10) || 0;
    let calculatedEndMinute =
      (parseInt(startMinute, 10) || 0) + durationMinutes;
    calculatedEndHour += Math.floor(calculatedEndMinute / 60);
    calculatedEndMinute = calculatedEndMinute % 60;
    calculatedEndHour = calculatedEndHour % 24;

    const endTime = `${
      calculatedEndHour < 10 ? `0${calculatedEndHour}` : calculatedEndHour
    }:${
      calculatedEndMinute < 10 ? `0${calculatedEndMinute}` : calculatedEndMinute
    }`;

    setCalculatedValues({
      totalMarks,
      endTime,
      timePerQuestion,
    });
  };

  useEffect(() => {
    calculateValues();
  }, [startHour, startMinute, duration, numQuestions, marksPerQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmationVisible(true);
  };

  const confirmCreateExam = async () => {
    const token = "your_jwt_token"; // You may want to retrieve this from local storage or context
    const instructorId = "668b947cab8a4c102ffb0b7a"; // Dynamic ID
    const organization = "PPI, Parul University"; // Dynamic organization

    try {
      const response = await axios.post(
        "http://localhost:5000/api/exams/create",
        {
          title,
          startDate,
          startHour,
          startMinute,
          duration,
          numQuestions,
          marksPerQuestion,
          type,
          instructor: instructorId,
          organization,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Exam created successfully!", response.data.exam);
      setConfirmationVisible(false);
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Failed to create exam.");
    }
  };

  const cancelCreateExam = () => {
    setConfirmationVisible(false);
  };

  return (
    <div className="create-exam">
      <h2>Create Exam</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Exam Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Exam Title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Time:</label>
          <select
            id="startHour"
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            required
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i < 10 ? `0${i}` : i}
              </option>
            ))}
          </select>
          <select
            id="startMinute"
            value={startMinute}
            onChange={(e) => setStartMinute(e.target.value)}
            required
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i < 10 ? `0${i}` : i}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (minutes)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numQuestions">Number of Questions:</label>
          <input
            type="number"
            id="numQuestions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            placeholder="Number of Questions"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="marksPerQuestion">Marks per Question:</label>
          <input
            type="number"
            id="marksPerQuestion"
            value={marksPerQuestion}
            onChange={(e) => setMarksPerQuestion(e.target.value)}
            placeholder="Marks per Question"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="MCQ">MCQ</option>
            {/* Add more options if needed */}
          </select>
        </div>
        <div className="calculated-values">
          <p>Total Marks: {calculatedValues.totalMarks}</p>
          <p>End Time: {calculatedValues.endTime}</p>
          <p>
            Time per Question: {calculatedValues.timePerQuestion.toFixed(2)}{" "}
            minutes
          </p>
        </div>
        <button type="submit">Create Exam</button>
      </form>

      {confirmationVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Exam Details</h3>
            <p>Title: {title}</p>
            <p>Date: {startDate}</p>
            <p>Start Time: {`${startHour}:${startMinute}`}</p>
            <p>End Time: {calculatedValues.endTime}</p>
            <p>Duration: {duration} minutes</p>
            <p>Number of Questions: {numQuestions}</p>
            <p>Marks per Question: {marksPerQuestion}</p>
            <p>Total Marks: {calculatedValues.totalMarks}</p>
            <p>
              Time per Question: {calculatedValues.timePerQuestion.toFixed(2)}{" "}
              minutes
            </p>
            <button onClick={confirmCreateExam}>Confirm</button>
            <button onClick={cancelCreateExam}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateExam;
