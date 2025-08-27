import React, { useState } from "react";
import flyerImage from "../assets/eduvibe.jpeg";
import { FaGoogle, FaApple, FaEnvelope, FaLock, FaFacebook } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [userPassword, setPassword] = useState("");
  const [userEmail, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(""); // For success/error messages
  const [isError, setIsError] = useState(false); // To track if message is an error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage("");

    try {
      const userData = {
        userEmail: userEmail,
        userPassword: userPassword,
      };

      const res = await axios.post(
        "http://192.168.6.128:3000/auth/login",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Check response body properly
      if (res.data && (res.data.success || res.data.token)) {
        setMessage("Login successful!");
        setEmail("");
        setPassword("");
        // Example: Save token for later authenticated requests
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
      } else {
        const errorMsg = res.data?.message || "Invalid credentials";
        setMessage(errorMsg);
        setIsError(true);
      }
    } catch (err) {
      console.error("Error details:", err.response?.data);
      const errorMessage =
        err.response?.data?.message || "Failed to login. Please try again.";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#D2E6E4] rounded-lg shadow-lg overflow-hidden">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src={flyerImage}
            alt="Education"
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-1">
            EduVibe
          </h2>
          <h3 className="text-xl text-center text-orange-500 font-semibold mb-6">
            Log in
          </h3>

          {/* Display success/error message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-md text-center ${
                isError
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <FaEnvelope className="mr-2" />
                User email
              </label>
              <input
                id="email"
                type="email"
                value={userEmail}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-1.5 mt-1 px-4 bg-gray-100 rounded border-t-1 border-b-1 border-gray-500 text-md pr-10 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <FaLock className="mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  className="bg-gray-100 p-1.5 px-4 w-full mt-1 rounded border-t-1 border-b-1 border-gray-500 text-md pr-10 focus:outline-none"
                  type={showPassword ? "text" : "password"}
                  value={userPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-3.5 text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-[#3442D9] transition"
            >
              Log in
            </button>

            {/* Signup Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?
              <Link
                to="/signup"
                className="text-purple-700 font-semibold ml-1 cursor-pointer hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>

          {/* Social Buttons */}
          <div className="mt-6 flex justify-center space-x-6">
            <button className="p-3 border rounded-full hover:bg-gray-100 transition">
              <FaGoogle size={20} />
            </button>
            <button className="p-3 border rounded-full hover:bg-gray-100 transition">
              <FaFacebook size={20} />
            </button>
            <button className="p-3 border rounded-full hover:bg-gray-100 transition">
              <FaApple size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
