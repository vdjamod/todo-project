import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">TODO Task</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center text-center mt-20 px-6 py-10 bg-white shadow-lg rounded-2xl max-w-2xl w-full">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Stay Organized with Todo App
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Manage your tasks efficiently and boost your productivity. With our
          easy-to-use Todo App, you can create, edit, and complete tasks
          effortlessly. Sign up now to get started!
        </p>

        {/* Buttons */}
        <div className="flex gap-6">
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:bg-blue-700 hover:scale-105"
          >
            Signup
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:bg-green-700 hover:scale-105"
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;
