import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuiz } from "../services/quizService";

function QuizForm() {
  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "medium", // Default to medium
    questionCount: "5", // Default to 5 questions
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Define difficulty options with labels, values, and colors
  const difficultyOptions = [
    {
      label: "Easy",
      value: "easy",
      color: "bg-green-100 border-green-400 text-green-800",
    },
    {
      label: "Medium",
      value: "medium",
      color: "bg-yellow-100 border-yellow-400 text-yellow-800",
    },
    {
      label: "Hard",
      value: "hard",
      color: "bg-red-100 border-red-400 text-red-800",
    },
  ];

  // Define question count presets
  const questionCountPresets = [5, 10, 15, 20];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const setDifficulty = (value) => {
    setFormData((prev) => ({
      ...prev,
      difficulty: value,
    }));
    setError("");
  };

  const setQuestionCount = (count) => {
    setFormData((prev) => ({
      ...prev,
      questionCount: count.toString(),
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.topic.trim()) {
      setError("Please enter a topic");
      return false;
    }
    if (!formData.difficulty) {
      setError("Please select a difficulty level");
      return false;
    }
    const count = parseInt(formData.questionCount);
    if (!count || count < 1 || count > 20) {
      setError("Please enter a valid number of questions (1-20)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("Form data being sent:", formData); // Debug log

      const response = await generateQuiz({
        topic: formData.topic.trim(),
        difficulty: formData.difficulty,
        questionCount: parseInt(formData.questionCount),
      });

      console.log("Response from server:", response); // Debug log

      if (response.success) {
        navigate(`/quiz/${response.quiz._id}`);
      } else {
        setError(response.error || "Failed to generate quiz");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto transform transition-all">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl">
          {/* Header with decorative elements */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 pt-6 pb-8 px-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-white">
              Create Your Quiz
            </h2>
            <p className="mt-2 text-center text-sm text-white text-opacity-80">
              Customize your quiz specifications below
            </p>
          </div>

          {/* Form Body */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Topic Input with icon */}
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  What topic would you like to be quizzed on?
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-3 py-3 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white text-md"
                    placeholder="e.g. JavaScript Promises, World History, Quantum Physics"
                    required
                  />
                </div>
              </div>

              {/* Difficulty Selection as interactive cards */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select difficulty level:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {difficultyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDifficulty(option.value)}
                      className={`
                        ${option.color} 
                        ${
                          formData.difficulty === option.value
                            ? "ring-2 ring-offset-2 ring-primary-500 dark:ring-primary-400"
                            : "opacity-75 hover:opacity-100"
                        } 
                        relative px-4 py-3 border rounded-lg shadow-sm flex items-center justify-center
                        transition-all duration-200 ease-in-out
                      `}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count with presets and custom input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of questions:
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {questionCountPresets.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`
                        ${
                          parseInt(formData.questionCount) === count
                            ? "bg-primary-100 border-primary-400 text-primary-800 dark:bg-primary-900 dark:border-primary-600 dark:text-primary-200 font-medium"
                            : "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        } 
                        px-4 py-2 border rounded-md transition-colors duration-200
                      `}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    id="questionCount"
                    name="questionCount"
                    value={formData.questionCount}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full py-2 px-3 border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter a number between 1 and 20
                  </p>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/40 p-4 animate-fade-in">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating your quiz...
                    </>
                  ) : (
                    <>
                      Generate Quiz
                      <svg
                        className="ml-2 -mr-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Tips for better quizzes
          </h3>
          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li className="flex items-start">
              <svg
                className="flex-shrink-0 h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2">
                Be specific with your topic (e.g. "Ancient Egyptian Pyramids"
                instead of just "History")
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="flex-shrink-0 h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2">
                Choose difficulty level based on your knowledge of the topic
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="flex-shrink-0 h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2">
                5-10 questions is ideal for most quiz sessions
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default QuizForm;
