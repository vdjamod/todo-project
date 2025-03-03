import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GeneralModal from "./GeneralModal.jsx";

function Header() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteAcc = async () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.delete("/API/delete", {
        headers: { token },
      });

      if (res.status === 200) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#1E293B] text-white py-4 px-6 flex justify-between items-center shadow-md z-50">
        <h1 className="text-3xl font-bold">TODO Task</h1>
        <div className="flex space-x-4">
          <button
            className="bg-red-500 hover:bg-red-600 focus:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
            aria-label="Delete Account"
            onClick={handleDeleteAcc}
          >
            Delete Account
          </button>
          <button
            className="flex items-center gap-2 px-6 py-2 text-lg font-semibold rounded-full shadow-md transition duration-300 
            bg-white text-indigo-700 hover:bg-gray-200 hover:scale-105 transform"
            aria-label="Logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <GeneralModal
            isOpen={isModalOpen}
            title="Confirm Account Deletion"
            message="Are you sure you want to delete your account? This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </header>
    </>
  );
}

export default Header;
