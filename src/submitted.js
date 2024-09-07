document.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const correctAnswers = urlParams.get("correctAnswers");
  const totalMarks = urlParams.get("totalMarks");
  const percentage = urlParams.get("percentage");

  const resultSummary = document.getElementById("result-summary");
  resultSummary.innerHTML = `
        <p>Correct Answers: ${correctAnswers}</p>
        <p>Total Marks: ${totalMarks}</p>
        <p>Percentage: ${parseFloat(percentage).toFixed(2)}%</p>
    `;

  window.goBackToExams = () => {
    window.location.href = "showexams.html";
  };
});
