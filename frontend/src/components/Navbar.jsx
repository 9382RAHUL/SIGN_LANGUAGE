import { Link } from "react-router-dom";
import Logo from "../assets/image.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <img src={Logo} alt="logo" className="w-60  h-24 " />
          </div>

          {/* Center Section - Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="text-black px-3 py-2 rounded-md text-xl font-medium transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-black px-3 py-2 rounded-md text-xl font-medium transition duration-300"
              >
                About Us
              </Link>
              <Link
                to="/isl-converter"
                className="text-black px-3 py-2 rounded-md text-xl font-medium transition duration-300"
              >
                ISL Converter
              </Link>
            </div>
          </div>

          {/* Right Section - User/Action Buttons */}
          {
            !localStorage.getItem("token") && 
            <div className="flex items-center">
            <Link
              to="/signin"
              className="bg-white text-black hover:bg-sky-100 px-4 py-2 rounded-md text-xl font-medium mr-2 transition duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-sky-700 text-white hover:bg-sky-800 px-4 py-2 rounded-md text-xl font-medium transition duration-300"
            >
              Sign Up
            </Link>
          </div>}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-sky-600 focus:outline-none transition duration-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="text-white hover:bg-sky-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:bg-sky-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Products
          </a>
          <a
            href="#"
            className="text-white hover:bg-sky-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Services
          </a>
          <a
            href="#"
            className="text-white hover:bg-sky-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
