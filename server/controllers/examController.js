const Exam = require("../models/Exam");
const Question = require("../models/question");
const User = require("../models/User");

exports.createExam = async (req, res) => {
  console.log(req.body);
  try {
    const {
      title,
      startDate,
      startHour,
      startMinute,
      duration,
      numQuestions,
      marksPerQuestion,
      type,
      instructor,
      organization,
    } = req.body;

    // Create start time in local timezone
    const startTime = new Date(
      `${startDate}T${String(startHour).padStart(2, "0")}:${String(
        startMinute
      ).padStart(2, "0")}:00`
    );
    console.log(startTime);

    // Calculate end time
    const endTime = new Date(startTime.getTime() + duration * 60000);
    console.log("endtime" + endTime);

    const totalMarks = numQuestions * marksPerQuestion;
    const timePerQuestion = duration / numQuestions;

    // Generate a unique examId
    const examId = `EXAM-${Date.now()}`; // Example, change as needed

    const newExam = new Exam({
      examId,
      title,
      instructor,
      startTime,
      endTime,
      duration,
      numQuestions,
      marksPerQuestion,
      totalMarks,
      type,
      organization,
      timePerQuestion,
    });

    await newExam.save();
    res
      .status(201)
      .json({ message: "Exam created successfully!", exam: newExam });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all exams by instructor ID
exports.getExamsByInstructor = async (req, res) => {
  console.log(req.params);
  try {
    const { instructorId } = req.params;
    const exams = await Exam.find({ instructor: instructorId });
    res.status(200).json({ exams });
    console.log("response sent");
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


// Add Questions to Exam
exports.addQuestions = async (req, res) => {
  try {
    const { examId } = req.params; // Get exam ID from the route
    const { questions } = req.body; // Questions payload from the request body

    // Find the exam by ID
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if adding the questions will exceed the total number of allowed questions
    if (exam.questions.length + questions.length > exam.numQuestions) {
      return res.status(400).json({
        message: `Cannot add more questions. The total allowed questions are ${exam.numQuestions}.`
      });
    }

    // Create and save questions
    const newQuestions = await Promise.all(
      questions.map(async (q) => {
        const question = new Question({
          exam: examId, // Associate question with the exam
          questionText: q.questionText,
          options: q.options
        });

        await question.save();
        return question._id;
      })
    );

    // Update the exam with new questions
    exam.questions.push(...newQuestions);
    await exam.save();

    res.status(200).json({
      message: 'Questions added successfully',
      exam
    });
  } catch (error) {
    console.error('Error adding questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get exam details by ID
exports.getExamById = async (req, res) => {
  try {
    const examId = req.params.examId; // Get the exam ID from the URL parameters
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Return exam details
    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/examController.js

// Endpoint to get questions for a specific exam
exports.getQuestionsForExam = async (req, res) => {
  try {
    const { examId } = req.params;

    // Fetch the exam to get total questions, added questions, and title
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Fetch questions for the given exam ID
    const questions = await Question.find({ exam: examId });

    res.status(200).json({
      examTitle: exam.title, // Include the exam title
      questions,
      totalQuestions: exam.numQuestions,
      questionsAdded: questions.length,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};




  // Controllers to serve the exam and questions to the student
exports.getStudentExams = async (req, res) => {
  try {
    const studentId = req.headers.studentid; // Assuming you pass studentID in headers

    // Step 1: Find the user by studentID (not _id)
    const student = await User.findOne({ studentID: studentId });
    
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Step 2: Find exams where the student's ObjectId is in allowedStudents
    const exams = await Exam.find({ allowedStudents: student._id });
    
    // Step 3: Map the exams to include necessary details
    const accessibleExams = exams.map((exam) => ({
      id: exam._id,
      title: exam.title,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      numQuestions: exam.numQuestions,
      marksPerQuestion: exam.marksPerQuestion,
      totalMarks: exam.totalMarks,
      type: exam.type,
      organization: exam.organization,
      timePerQuestion: exam.timePerQuestion,
    }));

    res.json({ exams: accessibleExams });
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams.", error });
  }
};
exports.getExamQuestions = async (req, res) => {
  try {
    const examId = req.params.examId;
    const exam = await Exam.findById(examId).populate("questions");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    const questions = exam.questions.map((question) => ({
      id: question._id,
      text: question.questionText,
      options: question.options.map((option) => ({
        text: option.text,
        id: option._id,
      })),
    }));

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions.", error });
  }
};
