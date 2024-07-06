document
  .getElementById("cheatingForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const examID = document.getElementById("examID").value.trim();
    const studentID = document.getElementById("studentID").value.trim();

    try {
      const response = await fetch("/cheating-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examID, studentID }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cheating attempts");
      }

      const cheatingAttempts = await response.json();
      displayCheatingAttempts(cheatingAttempts);
    } catch (error) {
      console.error("Error fetching cheating attempts:", error);
    }
  });

function displayCheatingAttempts(cheatingAttempts) {
  const container = document.getElementById("cheatingAttemptsContainer");
  container.innerHTML = "";

  cheatingAttempts.forEach((attempt) => {
    const attemptDiv = document.createElement("div");
    attemptDiv.className = "cheating-attempt";

    const img = new Image();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(attempt.screenshot.data))
    );
    img.src = `data:image/jpeg;base64,${base64String}`;
    attemptDiv.appendChild(img);

    const info = document.createElement("div");
    info.innerHTML = `
      <p><strong>Student ID:</strong> ${attempt.studentID}</p>
      <p><strong>Exam ID:</strong> ${attempt.examID}</p>
      <p><strong>Type:</strong> ${attempt.type}</p>
      <p><strong>Date:</strong> ${new Date(
        attempt.createdAt
      ).toLocaleString()}</p>
    `;
    attemptDiv.appendChild(info);

    container.appendChild(attemptDiv);
  });
}
