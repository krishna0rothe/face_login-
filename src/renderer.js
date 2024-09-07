// renderer.js
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("studentID");

    const examId = document.getElementById("examId").value;
    console.log("Exam ID (dummy field):", examId);

    const studentID = document.getElementById("studentId").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentID, password }),
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("studentID", studentID);
        console.log("Login successful. Token stored in local storage:", token);

        // Send token to main process
        window.electronAPI.sendToken(token);

        window.location.href = "face_verification.html"; // Redirect to face verification page
      } else {
        const result = await response.text();
        alert(result);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  });
