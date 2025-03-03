import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signin } from "../../store/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/API/user/login`, { email, password });
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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-[#1E293B] text-center mb-4">Welcome Back!</h2>

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link to="/forgetpassword" className="text-sm text-[#2563EB] hover:text-[#1E40AF] transition">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-[#2563EB] hover:scale-101 transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold text-[#2563EB] hover:text-[#1E40AF] transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
