import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailInput = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/API/sendmail", { email });

      if (res.status === 200) {
        alert("Mail sent successfully!");
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status outside the 2xx range
        if (error.response.status === 404) {
          alert("User not registered");
        } else {
          alert("Failed to send mail. Try again later.");
        }
      } else {
        // Network error or server not responding
        console.log("Error sending mail:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 border border-gray-300 rounded-lg w-96 shadow-lg bg-white"
      >
        <h2 className="text-lg font-semibold text-gray-700 text-center">
          Send mail
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default EmailInput;
