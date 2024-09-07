import React, { useState } from "react";
import axios from "../utils/axiosConfig"; // Importing the axios instance
import "../styles/InstructorLogin.css"; // Import custom styles

const InstructorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/instructor/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data; // Extract the token from response data

        setAlertColor("green");
        setAlertMessage("Login successful");

        // Store JWT token in local storage
        localStorage.setItem("jwtToken", token);

        // Redirect to the instructor dashboard or any desired page
        window.location.href = "/instructor/dashboard"; // Update the path as needed
      } else {
        setAlertColor("red");
        setAlertMessage(response.data || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in instructor:", error);
      setAlertColor("red");
      setAlertMessage("Error logging in instructor");
    }
  };

  return (
    <div className="login-container">
      <form id="loginForm" onSubmit={handleLogin}>
        <h1>Instructor Login</h1>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <div className="alert" id="loginAlert" style={{ color: alertColor }}>
          {alertMessage}
        </div>
      </form>
    </div>
  );
};

export default InstructorLogin;
