import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "./components/chat-img.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/signin", form);

      // Store token if login is successful
      localStorage.setItem("token", res.data.token);
      alert(res.data.message);

      // Redirect to homepage
      navigate("/isl-converter");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-br from-indigo-900 to-blue-400 text-white flex flex-col justify-center items-center p-10 relative">
        <img
          src={img}
          alt="rocket illustration"
          className="w-48 rounded-lg bg-blend-color-burn opacity-100"
        />
        <div className="max-w-sm text-center">
          <h2 className="lg:text-4xl font-bold mb-2">
            Welcome to the ISL Converter.
          </h2>
          <h3>For better experience please SignUp here</h3>
          <p className="mb-6 text-sm">
            Speak in any Indian language, express in signs — with just a click.
          </p>
          <a
            href="/signup"
            className="bg-white text-blue-500 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            SIGN UP
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 sm:px-16">
        <div className="w-full max-w-md m-4 border-gray-300">
          <h2 className="text-2xl font-bold mb-1">Welcome Back!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Create a new account
            </a>
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all"
            >
              Login with Email
            </button>
          </form>

          <div className="my-6 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-sm text-gray-500">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <p className="text-sm text-center text-gray-400 mt-6">
            Forgot your password?{" "}
            <a href="/forgot" className="text-blue-500 hover:underline">
              Reset here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
