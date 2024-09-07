document.addEventListener("DOMContentLoaded", () => {
  const dashboardContent = document.getElementById("dashboardContent");

  // Load results
  document
    .querySelector('a[href="results.html"]')
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const results = await response.json();
      displayResults(results);
    });

  // Load student performance
  document
    .querySelector('a[href="performance.html"]')
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/performance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const performance = await response.json();
      displayPerformance(performance);
    });

  // Load past exams
  document
    .querySelector('a[href="pastExams.html"]')
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/exams/past", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pastExams = await response.json();
      displayPastExams(pastExams);
    });

  function displayResults(results) {
    dashboardContent.innerHTML = "<h3>Exam Results</h3>";
    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Student ID</th>
        <th>Exam ID</th>
        <th>Score</th>
        <th>Correct Questions</th>
        <th>Attempted Questions</th>
      </tr>
    `;
    results.forEach((result) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${result.studentID}</td>
        <td>${result.examID}</td>
        <td>${result.score}</td>
        <td>${result.correctQuestions}</td>
        <td>${result.attemptedQuestions}</td>
      `;
      table.appendChild(row);
    });
    dashboardContent.appendChild(table);
  }

  function displayPerformance(performance) {
    dashboardContent.innerHTML = "<h3>Student Performance</h3>";
    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Student ID</th>
        <th>Exam ID</th>
        <th>Score</th>
      </tr>
    `;
    performance.forEach((perf) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${perf.studentID}</td>
        <td>${perf.examID}</td>
        <td>${perf.score}</td>
      `;
      table.appendChild(row);
    });
    dashboardContent.appendChild(table);
  }

  function displayPastExams(pastExams) {
    dashboardContent.innerHTML = "<h3>Past Exams</h3>";
    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Exam ID</th>
        <th>Title</th>
        <th>Date</th>
        <th>Number of Questions</th>
      </tr>
    `;
    pastExams.forEach((exam) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${exam.examID}</td>
        <td>${exam.title}</td>
        <td>${new Date(exam.date).toLocaleDateString()}</td>
        <td>${exam.questions.length}</td>
      `;
      table.appendChild(row);
    });
    dashboardContent.appendChild(table);
  }
});
