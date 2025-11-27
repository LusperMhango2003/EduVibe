import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import banner from "/src/assets/banner.svg";

const SignUp = () => {
  const [gender, setGender] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    setSuccess("");

    try {
      // ✅ Create JSON object that matches your DTO exactly
      const userData = {
        username: username,
        userEmail: userEmail,        // Matches DTO: userEmail
        userPassword: userPassword,  // Matches DTO: userPassword
        gender: gender
      };

      console.log("Sending data:", userData); // For debugging

      // ✅ Send as JSON (not FormData)
      const res = await axios.post("http://localhost:3000/users", userData, {
        headers: { 
          "Content-Type": "application/json" 
        },
      });
      
      if (res.status === 201 || res.status === 200) {
        setSuccess("Account created successfully!");  
        // Clear form
        setUsername("");
        setUserEmail("");
        setUserPassword("");
        setConfirmPassword("");
        setGender("");
      }
    } catch (err) {
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center xl:mb-0 mb-10 px-2 lg:mt-20">
      <div className="flex flex-col lg:flex-row items-center xl:w-[137vh] w-full max-w-[1200px] lg:h-[80vh]">
        {/* Banner */}
        <div className="w-full lg:ml-[12vh] lg:w-[250vh] h-full lg:h-[90vh] xl:h-[76vh] flex justify-center">
          <img
            src={banner}
            alt="Eduvibe"
            className="w-full h-full max-w-[500px] object-cover object-center mt-6 lg:mt-0 shadow rounded-l-lg"
          />
        </div>

        {/* Form */}
        <div className="w-full lg:w-[250vh] lg:mr-[12vh] lg:h-[90vh] xl:h-[76vh] h-full flex justify-center shadow">
          <div className="bg-[#D2E6E4] w-full max-w-[500px] h-full py-6 px-4 flex flex-col justify-center rounded-r-lg">
            <div className="flex flex-col">
              <div className="flex justify-center text-[#3442D9] font-bold text-2xl sm:text-3xl">
                <h1>EduVibe</h1>
              </div>
              <div className="flex justify-center text-[#FD905E] font-extrabold mt-2 text-lg sm:text-lg">
                <h2>Create Account</h2>
              </div>

              <form className="mt-5" onSubmit={handleSubmit}>
                <div className="flex justify-center">
                  <div className="space-y-4 w-full">
                    {/* Username */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <FaUser size={14} />
                        <label htmlFor="username" className="text-gray-800 text-md">
                          User name
                        </label>
                      </div>
                      <input
                        id="username"
                        className="bg-gray-100 p-1.5 w-full mt-1 rounded border-t border-b border-gray-500 text-sm"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <FaEnvelope size={16} />
                        <label htmlFor="userEmail" className=" text-gray-800 text-md">
                          User email
                        </label>
                      </div>
                      <input
                        id="userEmail"
                        className="bg-gray-100 p-1.5 w-full mt-1 rounded border-t border-b border-gray-500 text-sm"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col relative">
                      <div className="flex items-center gap-1">
                        <FaLock size={16} />
                        <label htmlFor="userPassword" className="text-gray-800 text-md">
                          User password
                        </label>
                      </div>
                      <input
                        id="userPassword"
                        className="bg-gray-100 p-1.5 w-full mt-1 rounded border-t border-b border-gray-500 text-sm pr-10"
                        type={showPassword ? "text" : "password"}
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-700"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col relative">
                      <div className="flex items-center gap-1">
                        <FaLock size={16} />
                        <label htmlFor="confirmPassword" className=" text-gray-800 text-md">
                          Confirm password
                        </label>
                      </div>
                      <input
                        id="confirmPassword"
                        className="bg-gray-100 p-1.5 w-full mt-1 rounded border-t border-b border-gray-500 text-sm pr-10"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-gray-700"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </button>
                    </div>

                    {/* Gender */}
                    <fieldset className="flex flex-col gap-2">
                      <legend className="text-gray-800 text-md">Select Gender</legend>
                      <div className="flex items-center gap-6">
                        <label
                          htmlFor="male"
                          className="inline-flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            id="male"
                            type="radio"
                            name="gender"
                            value="male"
                            checked={gender === "male"}
                            onChange={() => setGender("male")}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="text-gray-700">Male</span>
                        </label>
                        <label
                          htmlFor="female"
                          className="inline-flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            id="female"
                            type="radio"
                            name="gender"
                            value="female"
                            checked={gender === "female"}
                            onChange={() => setGender("female")}
                            className="form-radio h-4 w-4 text-pink-600"
                          />
                          <span className="text-gray-700">Female</span>
                        </label>
                      </div>
                    </fieldset>

                    {/* Error Message */}
                    {error && (
                      <div className="text-red-600 text-sm font-semibold text-center mt-2 p-2 bg-red-100 rounded">
                        {error}
                      </div>
                    )}

                    {/* Success Message */}
                    {success && (
                      <div className="text-green-600 text-sm font-semibold text-center mt-2 p-2 bg-green-100 rounded">
                        {success}
                      </div>
                    )}

                    {/* Signup button */}
                    <div className="flex justify-center mt-4">
                      <button
                        id="signup"
                        type="submit"
                        className="w-full bg-black hover:bg-[#3442D9] hover:text-white text-white font-semibold p-1.5 rounded transition duration-200"
                      >
                        Signup
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;