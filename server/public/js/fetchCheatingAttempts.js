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
          Authorization: `Bearer ${getCookie("jwtToken")}`,
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
    img.src = `data:image/jpeg;base64,${arrayBufferToBase64(
      attempt.screenshot.data
    )}`;
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

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper function to get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
