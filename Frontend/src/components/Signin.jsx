import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signin } from "../../store/authSlice";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/API/user/signin`, { email, password });
      localStorage.setItem("token", res.data);
      if (res.status === 201) {
        dispatch(signin());
        navigate("/user");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Invalid email or password");
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="max-w-md w-full bg-white bg-opacity-80 shadow-2xl rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Welcome Back!</h2>

        <form onSubmit={handleSignin} className="space-y-5">
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
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
