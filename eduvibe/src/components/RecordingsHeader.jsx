import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes, FaBell } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotifOpen(!isNotifOpen);
  };

  // Handler for navigation items that don't have real links yet
  const handleNavigationClick = (e, section) => {
    e.preventDefault();
    console.log(`Navigating to: ${section}`);
    // You can replace this with actual navigation logic
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // add your search logic here
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <header className="bg-white shadow-md relative pb-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-[#0B7077]">EduVibe</span>

          {/* Search bar - visible on medium screens and up */}
          <div className="hidden md:flex items-center">
            <nav className="ml-[15vh] relative">
              <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[#FF4B00] focus:outline-none rounded-lg p-3 w-[45vh] pr-10"
              />

              {/* X icon (clear input) */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}

              {/* Search button */}
              <button
                type="button"
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FF4B00] hover:text-black"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </nav>
          </div>
        </div>

        {/* Right: Notification + Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="text-gray-700 hover:text-[#0B7077] focus:outline-none relative"
              aria-label="Notifications"
            >
              <FaBell className="w-6 h-6" />
              {/* Example notification dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-20">
                <div className="p-4 border-b font-semibold text-gray-700">
                  Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  <li className="p-3 hover:bg-gray-100 cursor-pointer">
                    📢 New course available: React Basics
                  </li>
                  <li className="p-3 hover:bg-gray-100 cursor-pointer">
                    🎉 50% off on selected courses
                  </li>
                  <li className="p-3 hover:bg-gray-100 cursor-pointer">
                    📝 Assignment deadline tomorrow
                  </li>
                </ul>
                <div className="p-3 text-center border-t text-sm text-[#0B7077] cursor-pointer hover:bg-gray-50">
                  View all
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button - visible on small screens */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            <button
              onClick={(e) => handleNavigationClick(e, "Home")}
              className="text-gray-800 hover:text-[#0B7077] py-2 text-left bg-transparent border-none cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={(e) => handleNavigationClick(e, "About Us")}
              className="text-gray-800 hover:text-[#0B7077] py-2 text-left bg-transparent border-none cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={(e) => handleNavigationClick(e, "Courses")}
              className="text-gray-800 hover:text-[#0B7077] py-2 text-left bg-transparent border-none cursor-pointer"
            >
              Courses
            </button>
            <button
              onClick={(e) => handleNavigationClick(e, "Contact")}
              className="text-gray-800 hover:text-[#0B7077] py-2 text-left bg-transparent border-none cursor-pointer"
            >
              Contact
            </button>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-200 mt-2">
              <Link
                to="/login"
                className="block w-full text-center py-2 rounded-md font-medium transition-colors
                text-gray-800 hover:bg-gray-100 border border-gray-300 mb-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center py-2 rounded-md font-medium transition-colors
                bg-[#0B7077] text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
