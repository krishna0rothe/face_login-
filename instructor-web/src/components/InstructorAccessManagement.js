import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig"; // Adjust path as needed
import "../styles/InstructorAccessManagement.css"; // Adjust path as needed

const InstructorAccessManagement = () => {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(new Set());

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

    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/access/students"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchExams();
    fetchStudents();
  }, []);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(studentId)) {
        newSelected.delete(studentId);
      } else {
        newSelected.add(studentId);
      }
      return newSelected;
    });
  };

  const handleAssignExam = async () => {
    if (!selectedExam || selectedStudents.size === 0) {
      alert("Please select an exam and students to assign.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/access/assign-exam/${selectedExam}`,
        { studentIds: Array.from(selectedStudents) }
      );
      alert("Exam assigned successfully");
    } catch (error) {
      console.error("Error assigning exam:", error);
      alert("Failed to assign exam.");
    }
  };

  return (
    <div className="instructor-access-management">
      <h2>Manage Access to Exams</h2>

      <div className="exam-selection">
        <label htmlFor="exam">Select Exam:</label>
        <select id="exam" onChange={(e) => setSelectedExam(e.target.value)}>
          <option value="">--Select Exam--</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      <div className="student-selection">
        <label htmlFor="students">Select Students:</label>
        <div id="students">
          {students.map((student) => (
            <div key={student._id} className="student-item">
              <input
                type="checkbox"
                id={`student-${student._id}`}
                checked={selectedStudents.has(student._id)}
                onChange={() => handleCheckboxChange(student._id)}
              />
              <label htmlFor={`student-${student._id}`}>{student.name}</label>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleAssignExam}>Assign Exam</button>
    </div>
  );
};

export default InstructorAccessManagement;
