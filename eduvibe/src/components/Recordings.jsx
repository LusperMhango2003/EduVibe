import Header from "./RecordingsHeader";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaStickyNote, FaSignOutAlt } from "react-icons/fa";

const Recordings = () => {
  return (
    <div className="mt-8">
      {/* Header */}
      <Header />

      {/* Main layout: Sidebar + Content */}
      <div className="flex mt-8 container">
        {/* Sidebar */}
        <aside className=" w-48 flex flex-col space-y-2 border-r border-gray-200 pr-4">
          <Link
            to="/dashboard"
            className="flex items-center px-6 py-2 rounded-lg text-gray-700 hover:bg-[#FF4B00] hover:text-white transition"
          >
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </Link>
          <Link
            to="/notes"
            className="flex items-center px-6 py-2 rounded-lg text-gray-700 hover:bg-[#FF4B00] hover:text-white transition"
          >
            <FaStickyNote className="mr-2" />
            Notes
          </Link>
          <button
            className="flex items-center px-6 py-2 rounded-lg text-gray-700 hover:bg-[#FF4B00] hover:text-white transition"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </aside>

        {/* Page Content */}
        <main className="ml-8 space-y-2">
          <h1 className="font-inter font-bold text-2xl text-[#211C37]">
            Class Recordings
          </h1>
          <h2 className="font-inter font-regular text-lg text-[#85878D]">
            Access and Review Class Sessions
          </h2>
        </main>
      </div>
    </div>
  );
};

export default Recordings;
