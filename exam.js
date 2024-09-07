let currentQuestion = 0;
const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
  },
  // Add more questions as needed
];

function loadQuestion() {
  const question = questions[currentQuestion];
  document.getElementById("question-number").textContent = `Question ${
    currentQuestion + 1
  }`;
  document.getElementById("question-text").textContent = question.question;
  const options = document.querySelectorAll(".options-container label");
  options.forEach((label, index) => {
    label.querySelector("input").value = String.fromCharCode(65 + index);
    label.childNodes[1].textContent = `${String.fromCharCode(65 + index)}) ${
      question.options[index]
    }`;
  });
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

function finishExam() {
  alert("Exam submitted!");
  // Handle the exam submission logic
}

// Load the first question initially
loadQuestion();
