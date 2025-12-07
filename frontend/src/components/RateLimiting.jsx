import { FaHourglassHalf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/yt_icon.png";

const RateLimitPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="flex items-center gap-2 mb-8">
        <img src={logo} alt="YouTube Logo" className="w-10 h-auto" />
        <span className="font-roboto text-2xl tracking-tighter">YouTube</span>
      </div>

      <FaHourglassHalf size={70} className="text-gray-500 mb-6 animate-pulse" />

      <h1 className="text-3xl font-bold mb-4">You're doing that too much</h1>
      <p className="text-lg text-gray-400 mb-8 max-w-md">
        To protect our platform, we temporarily limit how often you can perform
        this action. Please wait a few moments and try again.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300 cursor-pointer"
      >
        Go to Home
      </button>

      <p className="text-xs text-gray-600 mt-12">
        Error 429: Too Many Requests
      </p>
    </div>
  );
};

export default RateLimitPage;
