const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const router = express.Router();
const Quiz = require("../models/Quiz");
const { protect } = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Helper function to generate quiz
async function generateQuizWithOpenAI(topic, difficulty, questionCount) {
  try {
    const prompt = `Create a ${difficulty} difficulty quiz about ${topic} with ${questionCount} questions. Format as JSON with structure: {
        "questions": [
          {
            "question": "question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": "correct option",
            "explanation": "explanation of answer"
          }
        ]
      }
      
      NOTE : all options should be distinct!
      `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // Parse the response and validate the JSON structure
    const quizData = JSON.parse(
      response.text.replace("```json", "").replace("```", "")
    );

    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid quiz format received from OpenAI");
    }

    return quizData;
  } catch (error) {
    console.error(error?.message);
    throw new Error("Quiz generation failed");
  }
}

// @route   POST /api/quiz/generate
// @desc    Generate a new quiz
// @access  Private
router.post("/generate", protect, async (req, res, next) => {
  try {
    const { topic, difficulty, questionCount } = req.body;

    // Input validation
    if (!topic || !difficulty || !questionCount) {
      return res.status(400).json({
        success: false,
        error: "Please provide topic, difficulty, and number of questions",
      });
    }

    // Validate difficulty
    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "Invalid difficulty level. Must be easy, medium, or hard",
      });
    }

    // Validate question count
    if (questionCount < 1 || questionCount > 20) {
      return res.status(400).json({
        success: false,
        error: "Question count must be between 1 and 20",
      });
    }

    // Check OpenAI API key
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OpenAI API key not configured",
      });
    }

    // Generate quiz
    const quizData = await generateQuizWithOpenAI(
      topic,
      difficulty,
      questionCount
    );

    // Save quiz to database
    const quiz = new Quiz({
      title: topic,
      topic,
      difficulty,
      questions: quizData.questions,
      createdBy: req.user._id,
    });

    await quiz.save();

    res.json({
      success: true,
      quiz: quiz,
    });
  } catch (error) {
    console.error("Quiz Generation Error:", error);

    // Provide more specific error messages
    if (error.message.includes("API key")) {
      return res.status(500).json({
        success: false,
        error: "API configuration error. Please contact support.",
      });
    }

    if (error.message.includes("Invalid quiz format")) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate a valid quiz. Please try again.",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to generate quiz. Please try again later.",
    });
  }
});

// @route   GET /api/quiz
// @desc    Get all quizzes for current user
// @access  Private
router.get("/", protect, async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/quiz/:id
// @desc    Get single quiz
// @access  Private
router.get("/:id", protect, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // Make sure user owns the quiz
    if (quiz.createdBy.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized to access this quiz" });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/quiz/:id
// @desc    Delete quiz
// @access  Private
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // Make sure user owns the quiz
    if (quiz.createdBy.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized to delete this quiz" });
    }

    await quiz.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
