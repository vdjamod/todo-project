import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";

function User() {
  const [flag, setFlag] = useState(false);
  const [todos, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [level, setLevel] = useState(1); // 1 = Easy, 2 = Medium, 3 = Hard
  const [selectedOption, setSelectedOption] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

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
    console.log(authStatus);
  }, [flag]);

  const addTask = async () => {
    if (!task.trim()) {
      alert("Task name is required");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/API/todo",
        { name: task, level },
        { headers: { token } }
      );
    } catch (error) {
      console.log("ADD Todo Error: " + error);
    }

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

    try {
      await axios.put(
        `/API/user/todo/delete/${todoId}`,
        {},
        { headers: { token } }
      );
      // setFlag((prev) => !prev);
    } catch (error) {
      console.log("Delete Todo Error: " + error);
    }

    let url = "";

    if (selectedOption) {
      url = date
        ? `/API/user/todo/filter/${date}/sort/${selectedOption}`
        : `/API/user/todo/sort/${selectedOption}`;
    } else {
      if (date) {
        url = `/API/user/todo/filter/${date}`;
      } else {
        setFlag((prevFlag) => !prevFlag);
        return;
      }
    }

    const res = await axios.get(url, {
      headers: {
        token,
      },
    });
    // console.log(res.data);
    setTasks(res.data);
  };

  const handleComplete = async (todoId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`/API/user/todo/${todoId}`, {}, { headers: { token } });
    } catch (error) {
      console.log("Complete Todo Error: " + error);
    }

    let url = "";

    if (selectedOption) {
      url = date
        ? `/API/user/todo/filter/${date}/sort/${selectedOption}`
        : `/API/user/todo/sort/${selectedOption}`;
    } else {
      if (date) {
        url = `/API/user/todo/filter/${date}`;
      } else {
        setFlag((prevFlag) => !prevFlag);
        return;
      }
    }

    try {
      const res = await axios.get(url, {
        headers: {
          token,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log("Complete Todo Error: " + error);
    }
  };

  const handleCompletedTodo = () => navigate("/user/todo/complete");

  const handleSelect = async (option) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User token not found.");
      return;
    }

    try {
      let url = "";
      if (selectedOption === option) {
        setSelectedOption(""); // Reset selection
        url = date ? `/API/user/todo/filter/${date}` : null;
      } else {
        url = date
          ? `/API/user/todo/filter/${date}/sort/${option}`
          : `/API/user/todo/sort/${option}`;
        setSelectedOption(option);
      }

      if (url) {
        const res = await axios.get(url, { headers: { token } });
        setTasks(res.data);
      } else {
        setFlag((prev) => !prev); // Trigger useEffect for default data
      }
    } catch (error) {
      console.error("Sort Todo Error:", error);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setDate(date);

    if (!date) {
      setFlag((prevFlag) => !prevFlag);
      return;
    }

    let url = selectedOption
      ? `/API/user/todo/filter/${date}/sort/${selectedOption}`
      : `/API/user/todo/filter/${date}`;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(url, {
        headers: {
          token,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log("Date Change Error: " + error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
            Todo App
          </h1>

          {/* Task Input */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Add
            </button>
          </div>

          {/* Difficulty Level */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Difficulty:{" "}
              <span className={`font-semibold ${getLevelColor(level)}`}>
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

          {/* Date Picker */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">
              Select a Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 transition"
            />
            {date && (
              <p className="mt-2 text-gray-700">Selected Date: {date}</p>
            )}
          </div>

          {/* Task List */}
          <ul className="space-y-4">
            {todos.map((todo, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-2 rounded-xl bg-gray-200 shadow-md transition hover:bg-gray-300"
              >
                <span
                  className={`font-medium text-gray-800 ${getLevelColor(
                    todo.level
                  )}`}
                >
                  {todo.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleComplete(todo._id)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Sort Options */}
          <div className="flex gap-6 mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOption === "asc"}
                onChange={() => handleSelect("asc")}
                className="w-5 h-5 accent-blue-600"
              />
              <span
                className={
                  selectedOption === "asc"
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
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
                  selectedOption === "desc"
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
                }
              >
                Sort Desc
              </span>
            </label>
          </div>

          {/* Completed Tasks Button */}
          <div className="mt-6">
            <button
              onClick={handleCompletedTodo}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
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
