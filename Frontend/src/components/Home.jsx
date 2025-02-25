import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      {/* <header className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">TODO App</h1>
      </header> */}

      {/* <Header /> */}

      {/* Main Content */}
      <main className="flex flex-col items-center text-center mt-16 px-4 max-w-2xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Stay Organized with Todo App
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your tasks efficiently and boost your productivity. With our
          easy-to-use Todo App, you can create, edit, and complete tasks
          effortlessly. Sign up now to get started!
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Signup
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700"
          >
            Signin
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;
