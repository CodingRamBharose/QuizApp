import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    const { email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setIsLoading(true);

    try {
      const result = await register(email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
  <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl transform transition-all duration-500 hover:shadow-2xl">
    {/* Avatar */}
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="w-28 h-28">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
            {/* Blue Circle Background */}
            <circle cx="100" cy="100" r="100" fill="#1D92FF" />

            {/* Darker Blue Shadow */}
            <path
              d="M100,0 C155.228,0 200,44.772 200,100 C200,155.228 155.228,200 100,200 C44.772,200 0,155.228 0,100 C0,44.772 44.772,0 100,0 Z"
              fill="#1D92FF"
            />
            <path
              d="M170,100 C170,138.66 138.66,170 100,170 C61.34,170 30,138.66 30,100 C30,61.34 61.34,30 100,30 C138.66,30 170,61.34 170,100 Z"
              fill="#1685E4"
            />

            {/* User Icon Head */}
            <circle cx="100" cy="80" r="30" fill="white" />

            {/* User Icon Body with Shadow */}
            <path
              d="M100,120 C130,120 140,140 145,180 L55,180 C60,140 70,120 100,120 Z"
              fill="white"
            />
            <path
              d="M100,120 C85,120 75,135 70,155 C70,160 75,162 85,165 L115,165 C125,162 130,160 130,155 C125,135 115,120 100,120 Z"
              fill="#1685E4"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        Create your account
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Or{" "}
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          sign in to existing account
        </Link>
      </p>
    </div>

    {error && (
      <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4 animate-fade-in">
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
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {error}
            </p>
          </div>
        </div>
      </div>
    )}

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
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
              Creating account...
            </div>
          ) : (
            "Sign up"
          )}
        </button>
      </div>
    </form>
  </div>
</div>
  );
}

export default Register;