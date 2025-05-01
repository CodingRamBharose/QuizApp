import axios from "axios";

// Generate a new quiz
export const generateQuiz = async (quizData) => {
  try {
    console.log("Sending quiz data:", quizData); // Debug log
    const response = await axios.post("/api/quiz/generate", {
      topic: quizData.topic,
      difficulty: quizData.difficulty,
      questionCount: parseInt(quizData.questionCount),
    });
    return { success: true, quiz: response.data.quiz };
  } catch (error) {
    console.error("Quiz generation error:", error.response?.data || error);
    return {
      success: false,
      error:
        error.response?.data?.error ||
        "Failed to generate quiz. Please try again.",
    };
  }
};

// Get all quizzes for current user
export const getUserQuizzes = async () => {
  try {
    const response = await axios.get("/api/quiz");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch quizzes.",
    };
  }
};

// Get a single quiz by ID
export const getQuizById = async (id) => {
  try {
    const response = await axios.get(`/api/quiz/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch quiz details.",
    };
  }
};

// Delete a quiz
export const deleteQuiz = async (id) => {
  try {
    await axios.delete(`/api/quiz/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to delete quiz.",
    };
  }
};
