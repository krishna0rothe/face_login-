import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ExamList from "./pages/ExamList";
import Reports from "./pages/Reports";
import Responses from "./pages/Responses";
//import Dashboard from "./pages/Dashboard";
import InstructorLogin from "./components/InstructorLogin";
import CreateExam from "./components/CreateExam";
import AddQuestions from "./components/AddQuestion";
import CheatingAttempts from "./components/CheatingAttempts";
import ViewQuestions from "./components/ViewQuestions";
import AccessManagement from "./components/InstructorAccessManagement";
import ResultExamList from "./components/ResultExamList";
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<InstructorLogin />} />
            <Route path="/add-questions/:examId" element={<AddQuestions />} />
            <Route path="/dashboard" element={<ExamList />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/results" element={< ResultExamList />} />
            <Route path="/create-exam" element={<CreateExam />} />
            <Route path="/cheating-attempts" element={<CheatingAttempts />} />
            <Route path="/view-questions/:examId" element={<ViewQuestions />} />
            <Route path="/access-management" element={<AccessManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
