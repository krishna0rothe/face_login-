import axios from "axios";

const API_URL = "http://localhost:5000/api/exams/instructor/";

export const fetchExams = async (instructorId) => {
  try {
    const response = await axios.get(`${API_URL}${instructorId}`);
    return response.data.exams;
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw error;
  }
};
