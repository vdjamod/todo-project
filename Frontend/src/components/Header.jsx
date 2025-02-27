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

    navigate('/');
  };

  return (
    <header className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">TODO Task</h1>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        aria-label="Logout"
        onClick={handleDelete}
      >
        Delete Account
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        aria-label="Logout"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
