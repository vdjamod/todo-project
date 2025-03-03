import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signin } from "../../store/authSlice";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validatePassword = (password) => {
    const minLength = /.{8,}/; // At least 8 characters
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/; // At least 1 special character
    const upperCase = /[A-Z]/; // At least 1 uppercase letter
    const lowerCase = /[a-z]/; // At least 1 lowercase letter
    const digit = /\d/; // At least 1 number
  
    if (
      !minLength.test(password) ||
      !specialChar.test(password) ||
      !upperCase.test(password) ||
      !lowerCase.test(password) ||
      !digit.test(password)
    ) {
      return "Password must be at least 8 characters long, include 1 special character, 1 uppercase letter, 1 lowercase letter, and 1 digit.";
    }
    return "";
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    const errorMessage = validatePassword(password);
    if (errorMessage) {
      setPasswordError(errorMessage);
      return;
    }
    setPasswordError("");
    try {
      const res = await axios.post("/API/user/signup", { name, email, password });
      localStorage.setItem("token", res.data);
      if (res.status === 201) {
        dispatch(signin());
        navigate("/user", { replace: true });
      }
    } catch (error) {
      console.log("Signup Error: " + error);
      alert("Signup Failed. Choose a different email.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-[#1E293B] text-center mb-4">Join with us!</h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2ECC71] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-[#27AE60] hover:scale-101 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#2563EB] hover:text-[#1E40AF] transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
