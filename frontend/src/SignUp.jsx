import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "./components/chat-img.png";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signup", form);
      alert(res.data.message);
      navigate("/signin");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-cyan-200">
    //   <form
    //     onSubmit={handleSubmit}
    //     className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md"
    //   >
    //     <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
    //     <input
    //       name="name"
    //       placeholder="Full Name"
    //       onChange={handleChange}
    //       className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    //     />
    //     <input
    //       name="email"
    //       type="email"
    //       placeholder="Email"
    //       onChange={handleChange}
    //       className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    //     />
    //     <input
    //       name="password"
    //       type="password"
    //       placeholder="Password"
    //       onChange={handleChange}
    //       className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
    //     />
    //     <button
    //       type="submit"
    //       className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
    //     >
    //       Sign Up
    //     </button>
    //   </form>
    // </div>

    <div className="min-h-screen flex">
      {/* Left Side: Welcome Message */}
      <div className="w-1/2 bg-gradient-to-br from-indigo-900 to-blue-400 text-white flex flex-col justify-center items-center p-10 relative">
        <img
          src={img}
          alt="rocket illustration"
          className="w-48 rounded-lg bg-blend-color-burn opacity-100 "
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
            href="/signin"
            className="bg-white text-blue-500 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            SIGN IN
          </a>
        </div>
      </div>

      {/* Right Side: Sign Up Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create Account
          </h2>

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all"
          >
            Sign Up
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
