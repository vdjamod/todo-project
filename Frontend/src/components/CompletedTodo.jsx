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
          headers: {
            token: token,
          },
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
      ? "text-orange-400"
      : "text-red-500";
  };

  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Completed Todos
        </h2>
        <ul className="space-y-3">
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
        <button
          onClick={handleBack}
          className="mt-2 bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>
    </>
  );
}

export default CompletedTodo;
