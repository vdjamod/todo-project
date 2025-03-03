import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPass = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  let { id } = useParams();
  const navigate = useNavigate();

  id = id.slice(3, -3);

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.post("/API/validate-user", { id });

        if (res.status !== 200) {
          alert("Reset Password Link is not valid");
          navigate("/forgetpassword");
        }
      } catch (error) {
        console.error("Error validating user:", error);
        // alert("Reset Password Link is not valid");
        navigate("/forgetpassword");
      }
    }
    getData();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault(); // Prevent form submission reload

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.put("/API/reset-pass", { id, newPassword });

      if (res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
