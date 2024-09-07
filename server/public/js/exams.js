document.addEventListener("DOMContentLoaded", () => {
  const instructorId = "668b947cab8a4c102ffb0b7a"; // Replace with actual instructor ID
  const examsContainer = document.getElementById("examsContainer");
  const examsList = document.getElementById("examsList");
  const examDetails = document.getElementById("examDetails");
  const examInfo = document.getElementById("examInfo");
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  const addQuestionForm = document.getElementById("addQuestionForm");
  const questionTextInput = document.getElementById("questionText");
  const optionsContainer = document.getElementById("optionsContainer");
  const addOptionBtn = document.getElementById("addOptionBtn");

  fetch(`http://localhost:3000/api/exams/instructor/${instructorId}`)
    .then((response) => response.json())
    .then((data) => {
      const exams = data.exams;
      exams.forEach((exam) => {
        const examElement = document.createElement("div");
        examElement.textContent = exam.title;
        examElement.addEventListener("click", () => showExamDetails(exam));
        examsList.appendChild(examElement);
      });
    })
    .catch((error) => console.error("Error fetching exams:", error));

  function showExamDetails(exam) {
    examInfo.innerHTML = `
      <p>Title: ${exam.title}</p>
      <p>Start Time: ${new Date(exam.startTime).toLocaleString()}</p>
      <p>End Time: ${new Date(exam.endTime).toLocaleString()}</p>
      <p>Duration: ${exam.duration} minutes</p>
      <p>Total Marks: ${exam.totalMarks}</p>
      <p>Number of Questions: ${exam.numQuestions}</p>
    `;
    examDetails.style.display = "block";

    addQuestionBtn.onclick = () => {
      addQuestionForm.style.display = "block";
      addQuestionForm.onsubmit = async (event) => {
        event.preventDefault();
        const questionText = questionTextInput.value;
        const options = [];
        document.querySelectorAll(".optionInput").forEach((optionInput) => {
          const isCorrect = optionInput.querySelector(".isCorrect").checked;
          const text = optionInput.querySelector(".optionText").value;
          options.push({ text, isCorrect });
        });

        const question = { text: questionText, options };
        try {
          const response = await fetch(
            `http://localhost:3000/api/exams/${exam._id}/questions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ questions: [question] }),
            }
          );

          const result = await response.json();
          if (!response.ok) {
            return alert(result.message);
          }

          alert("Question added successfully!");
        } catch (error) {
          console.error("Error adding question:", error);
          alert("An error occurred while adding the question.");
        }
      };
    };
  }

  addOptionBtn.addEventListener("click", () => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("optionInput");
    optionElement.innerHTML = `
      <input type="text" class="optionText">
      <input type="checkbox" class="isCorrect"> Correct
    `;
    optionsContainer.appendChild(optionElement);
  });
});
