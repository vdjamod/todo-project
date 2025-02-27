import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.delete("/API/delete", {
      headers: {
        token,
      },
    });

    navigate("/");
  };

  return (
    <header className="w-full bg-gray-800 text-white py-6 px-8 flex justify-between items-center shadow-lg">
      <h1 className="text-3xl font-bold">TODO Task</h1>
      <div className="flex space-x-4">
        <button
          className="bg-red-500 hover:bg-red-600 focus:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
          aria-label="Delete Account"
          onClick={handleDelete}
        >
          Delete Account
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 focus:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
          aria-label="Logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
