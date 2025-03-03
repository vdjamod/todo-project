import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed w-full bg-[#1E293B] text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">TODO Task</h1>
      </header>
      <div className="h-screen overflow-hidden flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
        {/* Header */}

        {/* Main Content */}
        <main className="overflow-hidden flex flex-col items-center text-center px-8 py-12 bg-white shadow-xl rounded-2xl max-w-2xl w-full border border-gray-200">
          <h2 className="text-4xl font-bold text-[#1E293B] mb-4">
            Stay Organized with Todo App
          </h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-md">
            Manage your tasks efficiently and boost your productivity. With our
            easy-to-use Todo App, you can create, edit, and complete tasks
            effortlessly. Sign up now to get started!
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-6 py-3 bg-[#2ECC71] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:bg-[#27AE60] hover:scale-105"
              aria-label="Sign up for the Todo App"
            >
              Signup
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:bg-[#1E40AF] hover:scale-105"
              aria-label="Log in to the Todo App"
            >
              Login
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
