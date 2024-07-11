document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const contactNumber = document.getElementById("contactNumber").value;
  const schoolOrganization =
    document.getElementById("schoolOrganization").value;
  const subjectRole = document.getElementById("subjectRole").value;

  const response = await fetch("/instructor/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      name,
      password,
      contactNumber,
      schoolOrganization,
      subjectRole,
    }),
  });

  const messageDiv = document.getElementById("message");
  if (response.ok) {
    messageDiv.textContent = "Signup successful!";
  } else {
    const error = await response.text();
    messageDiv.textContent = `Signup failed: ${error}`;
  }
});
