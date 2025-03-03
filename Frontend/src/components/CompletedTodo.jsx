import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function CompletedTodo() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/API/user/todo/complete", {
          headers: { token: token },
        });
        setTodos(res.data);
      } catch (error) {
        console.log("Get Completed Todo Error: " + error);
      }
    }

    getData();
  }, []);

  const handleBack = () => {
    navigate("/user");
  };

  const getLevelColor = (level) => {
    return level === 1
      ? "text-green-500"
      : level === 2
      ? "text-orange-500"
      : "text-red-500";
  };

  return (
    <>
      <Header />
      <div className="h-screen pt-24 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <main className="overflow-hidden flex flex-col items-center text-center px-8 py-12 bg-white shadow-xl rounded-2xl max-w-lg w-full border border-gray-200">
          <h2 className="text-3xl font-bold text-[#1E293B] mb-4">
            Completed Todos
          </h2>
          {todos.length > 0 ? (
            <ul className="w-full space-y-3 max-h-80 overflow-y-auto p-2 border rounded-lg">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex items-center justify-between bg-green-100 border border-green-300 p-3 rounded-md shadow-sm"
                >
                  <span className={`font-medium ${getLevelColor(todo.level)}`}>
                    {todo.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No completed tasks yet.</p>
          )}
          <button
            onClick={handleBack}
            className="mt-6 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:bg-[#1E40AF] "
          >
            Back
          </button>
        </main>
      </div>
    </>
  );
}

export default CompletedTodo;
