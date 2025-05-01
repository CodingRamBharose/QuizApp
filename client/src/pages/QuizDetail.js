import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuizById } from "../services/quizService";

function QuizDetail() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await getQuizById(id);

        if (response.success) {
          setQuiz(response.data);
        } else {
          setError(response.error || "Failed to load quiz. Please try again.");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerSelect = (answer) => {
    if (showExplanation) return; // Don't allow changing answer after explanation is shown

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });

    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setShowExplanation(false);
  };

  const renderQuestion = () => {
    const question = quiz.questions[currentQuestionIndex];
    const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-primary-600">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
            {quiz.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedAnswers[currentQuestionIndex] === option
                  ? showExplanation
                    ? option === question.correctAnswer
                      ? "bg-green-100 border border-green-400"
                      : "bg-red-100 border border-red-400"
                    : "bg-primary-100 border border-primary-300"
                  : showExplanation && option === question.correctAnswer
                  ? "bg-green-100 border border-green-400"
                  : "hover:bg-gray-100 border border-gray-300"
              }`}
              onClick={() => handleAnswerSelect(option)}
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{option}</p>
              </div>
              {showExplanation && option === question.correctAnswer && (
                <svg
                  className="h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {showExplanation &&
                selectedAnswers[currentQuestionIndex] === option &&
                option !== question.correctAnswer && (
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
            </div>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800">Explanation:</h4>
            <p className="mt-1 text-sm text-blue-700">{question.explanation}</p>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`btn ${
              currentQuestionIndex === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "btn-secondary"
            }`}
          >
            Previous
          </button>

          <div>
            {isAnswered && !showExplanation && (
              <button
                onClick={() => setShowExplanation(true)}
                className="mr-2 btn btn-secondary"
              >
                Check Answer
              </button>
            )}

            <button
              onClick={handleNextQuestion}
              className="btn btn-primary"
              disabled={!isAnswered}
            >
              {currentQuestionIndex === quiz.questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    let resultMessage = "";
    if (percentage >= 80) {
      resultMessage = "Excellent work!";
    } else if (percentage >= 60) {
      resultMessage = "Good job!";
    } else if (percentage >= 40) {
      resultMessage = "Nice try!";
    } else {
      resultMessage = "Keep practicing!";
    }

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Quiz Results
        </h2>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-100 text-primary-800 text-2xl font-bold">
            {score}/{quiz.questions.length}
          </div>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {percentage}% - {resultMessage}
          </p>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((question, index) => {
            const isCorrect = selectedAnswers[index] === question.correctAnswer;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 mt-1 h-5 w-5 rounded-full ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    } flex items-center justify-center`}
                  >
                    {isCorrect ? (
                      <svg
                        className="h-3 w-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-3 w-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Question {index + 1}: {question.question}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Your answer: {selectedAnswers[index]}
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-sm font-medium text-green-600">
                        Correct answer: {question.correctAnswer}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={resetQuiz} className="btn btn-primary mx-2">
            Try Again
          </button>
          <Link to="/dashboard" className="btn btn-secondary mx-2">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <Link to="/dashboard" className="btn btn-primary text-sm">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="mt-1 text-sm text-gray-500">Topic: {quiz.topic}</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary text-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {showResults ? renderResults() : renderQuestion()}
    </div>
  );
}

export default QuizDetail;
