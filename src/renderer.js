document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("studentID");

    const studentID = document.getElementById("studentID").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/login", {
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
      window.location.href = "face_verification.html"; // Redirect to face verification page
    } else {
      const result = await response.text();
      alert(result);
    }
  });
