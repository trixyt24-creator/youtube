import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "../components/CustomAlert";
import logo from "../assets/yt_icon.png";
import axios from "axios";
import { serverURL } from "../App";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);

  // otp & email fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // password & confirmPassword fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // send otp from backend
  const handleSendOtp = async () => {
    if (!email) {
      showCustomAlert("Email is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/auth/send-otp`,
        { email },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      showCustomAlert(res.data.message);
      setStep(step + 1);
    } catch (error) {
      console.log(error);
      showCustomAlert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // verify otp
  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      showCustomAlert("OTP must be of 4 digits");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/auth/verify-otp`,
        { email, otp },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      showCustomAlert(res.data.message);
      setStep(step + 1);
    } catch (error) {
      console.log(error);
      showCustomAlert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // reset your password
  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      showCustomAlert("Password does not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/auth/reset-password`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      showCustomAlert(res.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      showCustomAlert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181818] min-h-screen flex flex-col text-white">
      <header className="flex items-center gap-2 p-4 border-b border-gray-700">
        <img src={logo} alt="" className="w-10" />
        <span className="font-roboto text-2xl tracking-tighter ">YouTube</span>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-[#202124] p-10 rounded-2xl w-full  max-w-md shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
              className="cursor-pointer"
            >
              <FaArrowLeft />
            </button>
            <span className="font-medium">YouTube</span>
          </div>
          {/* step 1 */}
          {step === 1 && (
            <div>
              <h1 className="flex text-2xl items-center gap-2">
                <img src={logo} alt="logo" className="size-9" />
                Forgot Password
              </h1>
              <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded mb-2 transition duration-500 ease-in-out focus:outline-none focus:border-red-500"
                  required
                />
              </form>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-red-500 text-white p-2 font-medium rounded-full mt-6 transition duration-300 ease-in-out cursor-pointer hover:bg-red-600"
              >
                {loading ? <ClipLoader color="black" size={20} /> : "Send OTP"}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full border-red-500 border-1 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          )}
          {/* step 2 */}
          {step === 2 && (
            <div>
              <h1 className="flex text-2xl items-center gap-2">
                <img src={logo} alt="logo" className="size-9" />
                Enter OTP
              </h1>
              <div className="mt-3 flex items-center bg-[#3c4043] px-4 py-2 rounded-full w-fit">
                <FaUserCircle className="mr-2 size-5" />
                {email}
              </div>
              <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Enter 4 Digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded mb-2 transition duration-500 ease-in-out focus:outline-none focus:border-red-500"
                />
              </form>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-red-500 text-white p-2 font-medium rounded-full mt-6 transition duration-300 ease-in-out cursor-pointer hover:bg-red-600"
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}
          {/* step 3 */}
          {step === 3 && (
            <div>
              <h1 className="flex text-2xl items-center gap-2">
                <img src={logo} alt="logo" className="size-9" />
                Reset Password
              </h1>
              <div>
                <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded mb-2 transition duration-500 ease-in-out focus:outline-none focus:border-red-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded mb-2 transition duration-500 ease-in-out focus:outline-none focus:border-red-500"
                  />
                </form>
                <div className="flex items-center mt-3 gap-2">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span>Show Password</span>
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-red-500 text-white p-2 font-medium rounded-full mt-6 transition duration-300 ease-in-out cursor-pointer hover:bg-red-600"
                >
                  {loading ? (
                    <ClipLoader color="black" size={20} />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
