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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="max-w-md w-full bg-white bg-opacity-80 shadow-2xl rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Create an Account</h2>

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
              className="mt-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 transition-all"
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
              className="mt-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link to="/forgetpassword" className="text-sm text-indigo-600 hover:text-indigo-500 transition">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 transition-all"
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
