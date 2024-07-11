document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginAlert = document.getElementById("loginAlert");

    try {
      const response = await fetch("/instructor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        loginAlert.style.color = "green";
        loginAlert.textContent = "Login successful";
        // Handle successful login (e.g., redirect to instructor dashboard)
      } else {
        loginAlert.style.color = "red";
        loginAlert.textContent = result.message;
      }
    } catch (error) {
      console.error("Error logging in instructor:", error);
      loginAlert.style.color = "red";   
      loginAlert.textContent = "Error logging in instructor";
    }
  });
