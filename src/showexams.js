document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwtToken"); // Get token from local storage

  async function loadExams() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/exams/get-exams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            studentId: localStorage.getItem("studentID"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Exams data:", data); // For debugging    
      const exams = data.exams;

      const examList = document.getElementById("exam-list");
      exams.forEach((exam) => {
        const examItem = document.createElement("div");
        examItem.className = "exam-item";
        examItem.innerHTML = `
          <h2>${exam.title}</h2>
          <p>Start Time: ${new Date(exam.startTime).toLocaleString()}</p>
          <p>End Time: ${new Date(exam.endTime).toLocaleString()}</p>
          <button onclick="startExam('${exam.id}')">Start Exam</button>
        `;
        examList.appendChild(examItem);
      });
    } catch (error) {
      console.error("Error loading exams:", error);
    }
  }

  // Define the function globally
  window.startExam = (examId) => {
    console.log("Exam ID:", examId); // For debugging
    window.location.href = `exam.html?examId=${examId}`;
  };

  loadExams();
});
