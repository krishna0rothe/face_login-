document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createExamForm");
  const startDateInput = document.getElementById("startDate");
  const startHourInput = document.getElementById("startHour");
  const startMinuteInput = document.getElementById("startMinute");
  const durationInput = document.getElementById("duration");
  const numQuestionsInput = document.getElementById("numQuestions");
  const marksPerQuestionInput = document.getElementById("marksPerQuestion");
  const totalMarksDisplay = document.getElementById("totalMarks");
  const examDurationDisplay = document.getElementById("examDuration");
  const timePerQuestionDisplay = document.getElementById("timePerQuestion");
  const endTimeDisplay = document.getElementById("endTime");

  const confirmationModal = document.getElementById("confirmationModal");
  const confirmTitle = document.getElementById("confirmTitle");
  const confirmStartTime = document.getElementById("confirmStartTime");
  const confirmEndTime = document.getElementById("confirmEndTime");
  const confirmDuration = document.getElementById("confirmDuration");
  const confirmNumQuestions = document.getElementById("confirmNumQuestions");
  const confirmMarksPerQuestion = document.getElementById(
    "confirmMarksPerQuestion"
  );
  const confirmTotalMarks = document.getElementById("confirmTotalMarks");
  const confirmTimePerQuestion = document.getElementById(
    "confirmTimePerQuestion"
  );
  const confirmCreateExam = document.getElementById("confirmCreateExam");
  const cancelCreateExam = document.getElementById("cancelCreateExam");

  // Populate hour and minute dropdowns
  for (let i = 0; i < 24; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i < 10 ? `0${i}` : i;
    startHourInput.add(option);
  }

  for (let i = 0; i < 60; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i < 10 ? `0${i}` : i;
    startMinuteInput.add(option);
  }

  function formatTo24Hour(hour, minute) {
    return `${hour}:${minute < 10 ? "0" + minute : minute}`;
  }

  function calculateEndTime(startTime, duration) {
    const [hour, minute] = startTime.split(":").map(Number);
    const totalMinutes = hour * 60 + minute + duration;
    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMinute = totalMinutes % 60;
    return { hour: endHour, minute: endMinute };
  }

  function calculateValues() {
    const startDate = startDateInput.value;
    const startHour = parseInt(startHourInput.value, 10);
    const startMinute = parseInt(startMinuteInput.value, 10);
    const duration = parseInt(durationInput.value, 10);
    const numQuestions = parseInt(numQuestionsInput.value, 10);
    const marksPerQuestion = parseInt(marksPerQuestionInput.value, 10);

    if (!isNaN(startHour) && !isNaN(startMinute) && !isNaN(duration)) {
      const startTime = `${startHour}:${startMinute}`;
      const { hour: endHour, minute: endMinute } = calculateEndTime(
        startTime,
        duration
      );
      const formattedEndTime = formatTo24Hour(endHour, endMinute);
      endTimeDisplay.textContent = `End Time: ${formattedEndTime}`;
    } else {
      endTimeDisplay.textContent = "";
    }

    if (!isNaN(numQuestions) && !isNaN(marksPerQuestion)) {
      const totalMarks = numQuestions * marksPerQuestion;
      totalMarksDisplay.textContent = `Total Marks: ${totalMarks}`;
    } else {
      totalMarksDisplay.textContent = "";
    }

    if (!isNaN(duration) && !isNaN(numQuestions)) {
      const timePerQuestion = duration / numQuestions;
      examDurationDisplay.textContent = `Exam Duration: ${duration} minutes`;
      timePerQuestionDisplay.textContent = `Time per Question: ${timePerQuestion.toFixed(
        2
      )} minutes`;
    } else {
      examDurationDisplay.textContent = "";
      timePerQuestionDisplay.textContent = "";
    }
  }

  startHourInput.addEventListener("change", calculateValues);
  startMinuteInput.addEventListener("change", calculateValues);
  durationInput.addEventListener("input", calculateValues);
  numQuestionsInput.addEventListener("input", calculateValues);
  marksPerQuestionInput.addEventListener("input", calculateValues);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const startDate = startDateInput.value;
    const startHour = startHourInput.value;
    const startMinute = startMinuteInput.value;
    const duration = parseInt(durationInput.value, 10);
    const numQuestions = parseInt(numQuestionsInput.value, 10);
    const marksPerQuestion = parseInt(marksPerQuestionInput.value, 10);
    const type = document.getElementById("type").value;

    confirmTitle.textContent = `Title: ${title}`;
    confirmStartTime.textContent = `Start Time: ${formatTo24Hour(
      startHour,
      startMinute
    )}`;
    confirmEndTime.textContent = `End Time: ${endTimeDisplay.textContent.replace(
      "End Time: ",
      ""
    )}`;
    confirmDuration.textContent = `Duration: ${duration} minutes`;
    confirmNumQuestions.textContent = `Number of Questions: ${numQuestions}`;
    confirmMarksPerQuestion.textContent = `Marks per Question: ${marksPerQuestion}`;
    confirmTotalMarks.textContent = `Total Marks: ${
      numQuestions * marksPerQuestion
    }`;
    confirmTimePerQuestion.textContent = `Time per Question: ${(
      duration / numQuestions
    ).toFixed(2)} minutes`;

    confirmationModal.style.display = "block";

    confirmCreateExam.onclick = async () => {
      confirmationModal.style.display = "none";
      // Replace 'token' with actual JWT token
      const token = "your_jwt_token";
      const instructorId = "668b947cab8a4c102ffb0b7a"; // Replace with actual instructor ID
      const organization = "PPI, Parul University"; // Replace with actual organization

      const createExamResponse = await fetch(
        "http://localhost:3000/api/exams/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            startDate,
            startHour,
            startMinute,
            duration,
            numQuestions,
            marksPerQuestion,
            type,
            instructor: instructorId,
            organization,
          }),
        }
      );

      const createExamResult = await createExamResponse.json();
      if (!createExamResponse.ok) {
        return alert(createExamResult.message);
      }

      alert("Exam created successfully!");
    };

    cancelCreateExam.onclick = () => {
      confirmationModal.style.display = "none";
    };
  });
});
