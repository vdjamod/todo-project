import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function User() {
  const [flag, setFlag] = useState(false);
  const [todos, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [level, setLevel] = useState(1); // 1 = Easy, 2 = Medium, 3 = Hard
  const [selectedOption, setSelectedOption] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/API/todo/all", { headers: { token } });
        setTasks(res.data);
      } catch (error) {
        console.log("All Todo Error: " + error);
      }
    }
    getData();
  }, [flag]);

  const addTask = async () => {
    if (!task.trim()) {
      alert("Task name is required");
      return;
    }
    const token = localStorage.getItem("token");
    await axios.post(
      "/API/todo",
      { name: task, level },
      { headers: { token } }
    );

    // console.log(selectedOption);
    if (selectedOption) {
      try {
        const res = await axios.get(`/API/user/todo/sort/${selectedOption}`, {
          headers: { token },
        });
        setTasks(res.data);
      } catch (error) {
        console.log("Sort Todo Error: " + error);
      }
    } else {
      setFlag((prev) => !prev);
    }
    setTask("");
  };

  const handleDelete = async (todoId) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `/API/user/todo/delete/${todoId}`,
      {},
      { headers: { token } }
    );
    setFlag((prev) => !prev);
  };

  const handleComplete = async (todoId) => {
    const token = localStorage.getItem("token");
    await axios.put(`/API/user/todo/${todoId}`, {}, { headers: { token } });
    setFlag((prev) => !prev);
  };

  const handleCompletedTodo = () => navigate("/user/todo/complete");

  const handleSelect = async (option) => {
    if (selectedOption === option) {
      setSelectedOption(""); // Reset selection
      setFlag((prev) => !prev); // Trigger useEffect to fetch default data
    } else {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/API/user/todo/sort/${option}`, {
        headers: { token },
      });
      setTasks(res.data);
      setSelectedOption(option);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setDate(date);

    const token = localStorage.getItem("token");

    const res = await axios.get(`/API/user/todo/filter/${date}`, {
      headers: {
        token,
      },
    });

    setTasks(res.data);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">
            Todo App
          </h1>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Difficulty:{" "}
              <span className={getLevelColor(level)}>
                {level === 1 ? "Easy" : level === 2 ? "Medium" : "Hard"}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="3"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          <div className="p-4">
            <label className="block text-lg font-medium mb-2">
              Select a Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="border rounded-lg p-2 w-full"
            />
            {date && (
              <p className="mt-2 text-gray-700">Selected Date: {date}</p>
            )}
          </div>

          <ul className="space-y-3">
            {todos.map((todo, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-4 rounded-lg bg-gray-100 shadow"
              >
                <span className={`text-gray-800 ${getLevelColor(todo.level)}`}>
                  {todo.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleComplete(todo._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Checkbox */}
          <div className="flex gap-4 mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOption === "asc"}
                onChange={() => handleSelect("asc")}
                className="w-5 h-5 accent-blue-600"
              />
              <span
                className={
                  selectedOption === "asc" ? "text-blue-600" : "text-gray-600"
                }
              >
                Sort Asc
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOption === "desc"}
                onChange={() => handleSelect("desc")}
                className="w-5 h-5 accent-blue-600"
              />
              <span
                className={
                  selectedOption === "desc" ? "text-blue-600" : "text-gray-600"
                }
              >
                Sort Desc
              </span>
            </label>
          </div>

          <div className="mt-4">
            <button
              onClick={handleCompletedTodo}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Completed Todo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
