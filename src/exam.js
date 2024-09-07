document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwtToken"); // Get token from local storage
  const studentId = localStorage.getItem("studentId"); // Get student ID from local storage
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const examId = urlParams.get("examId"); // Retrieve examId from URL
  console.log("Exam ID:", examId); // For debugging
  console.log("Token:", token); // For debugging  

  let currentQuestionIndex = 0;
  let questions = [];
  let responses = [];

  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const threshold = 0.2; // Adjusted threshold for object detection
  const worker = new Worker("src/worker.js");

  // Initialize camera and start detection
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        detectCheating(); // Start detecting cheating in live feed
      };
    })
    .catch((error) => {
      console.error("Error accessing webcam:", error);
    });

  async function loadQuestions() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/exams/${examId}/questions/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      questions = data.questions;

      if (questions.length > 0) {
        displayQuestion(currentQuestionIndex);
      } else {
        document.getElementById("app").innerHTML =
          "<p>No questions available for this exam.</p>";
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  }

  function displayQuestion(index) {
    const question = questions[index];
    const questionContainer = document.getElementById("question-container");

    const optionsHtml = question.options
      .map((option, i) => {
        return `
          <label>
            <input type="radio" name="option" value="${option.text}" ${
          responses[index] === option.text ? "checked" : ""
        }>
            ${option.text}
          </label><br>
        `;
      })
      .join("");

    questionContainer.innerHTML = `
      <h2>Question ${index + 1}</h2>
      <p>${question.questionText}</p>
      <div>${optionsHtml}</div>
    `;

    updateNavigationButtons();
  }

  window.prevQuestion = () => {
    saveResponse();
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion(currentQuestionIndex);
    }
  };

  window.nextQuestion = () => {
    saveResponse();
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(currentQuestionIndex);
    }
  };

  function saveResponse() {
    const selectedOption = document.querySelector(
      'input[name="option"]:checked'
    );
    if (selectedOption) {
      responses[currentQuestionIndex] = selectedOption.value;
    }
  }

  window.submitExam = async () => {
    saveResponse();
    try {
      const formattedResponses = questions.map((question, index) => ({
        question: question._id,
        selectedOption: responses[index] || "",
      }));

      const response = await fetch(
        `http://localhost:5000/api/exams/${examId}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            studentId: localStorage.getItem("studentID"),
          },
          body: JSON.stringify({ examId, responses: formattedResponses }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        window.location.href = `submitted.html?correctAnswers=${result.correctAnswers}&totalMarks=${result.totalMarks}&percentage=${result.percentage}`;
      } else {
        console.error("Error submitting exam:", result.message);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  function updateNavigationButtons() {
    document.getElementById("prev-btn").style.display =
      currentQuestionIndex === 0 ? "none" : "inline-block";
    document.getElementById("next-btn").style.display =
      currentQuestionIndex === questions.length - 1 ? "none" : "inline-block";
    document.getElementById("submit-btn").style.display =
      currentQuestionIndex === questions.length - 1 ? "inline-block" : "none";
  }

  function detectCheating() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    worker.postMessage({
      imageData,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    setTimeout(detectCheating, 500); // Adjust detection frequency if needed
  }

  worker.onmessage = function (event) {
    const predictions = event.data.predictions;

    const phoneDetected = predictions.some(
      (prediction) =>
        prediction.class === "cell phone" && prediction.score >= threshold
    );

    const personsDetected = predictions.filter(
      (prediction) =>
        prediction.class === "person" && prediction.score >= threshold
    ).length;

    if (phoneDetected) {
      alert("Warning: Phone detected during exam. Please remove it.");
      const screenshot = canvas.toDataURL("image/jpeg");
      sendCheatingAttempt(screenshot, "Phone detected during exam");
    }

    if (personsDetected > 1) {
      alert("Warning: Multiple persons detected during exam.");
      const screenshot = canvas.toDataURL("image/jpeg");
      sendCheatingAttempt(screenshot, "Multiple person detected during exam");
    }
  };

  function sendCheatingAttempt(screenshot, type) {
    const token = localStorage.getItem("jwtToken");
    console.log("Token retrieved from localStorage:", token);
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    fetch(screenshot)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append("screenshot", blob, "screenshot.jpg");
        formData.append("type", type);
        formData.append("examID", examId);

        fetch("http://localhost:5000/cheating-attempts/store", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to log cheating attempt");
            }
            console.log("Cheating attempt logged successfully");
          })
          .catch((error) => {
            console.error("Error logging cheating attempt:", error);
          });
      })
      .catch((error) => {
        console.error("Error converting screenshot to Blob:", error);
      });
  }

  loadQuestions();
});
