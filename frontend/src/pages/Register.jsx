import axios from "axios";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import { ClipLoader } from "react-spinners";
import { showCustomAlert } from "../components/CustomAlert";
import logo from "../assets/yt_icon.png";
import { useUserStore } from "../store/useUserStore";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);

  // name & email fields
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  // otp & email fields
  const [otp, setOtp] = useState("");

  // password & confirmPassword fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // image showing in frontend and backend
  const [frontendImage, setFrontendImage] = useState(null); // shown in frontend
  const [backendImage, setBackendImage] = useState(null); // send to backend

  // set current user when loggedIn
  const { setLoggedInUserData } = useUserStore();

  // handling next button
  const handleNext = () => {
    if (step == 1) {
      if (!userName || !email) {
        showCustomAlert("Please fill all the fields");
        return;
      }
    } else if (step == 2) {
      if (otp.length !== 4) {
        showCustomAlert("OTP must be of 4 digits");
        return;
      }
    } else if (step == 3) {
      if (!password || !confirmPassword) {
        showCustomAlert("Please fill all the fields");
        return;
      } else if (password !== confirmPassword) {
        showCustomAlert("Password does not match");
        return;
      }
    }
    setStep(step + 1);
  };

  // handling image submission
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file)); // creating URL so that we can show it using image tag in frontend
  };

  // handling submit button
  const handleSubmit = async () => {
    if (!backendImage) {
      showCustomAlert("Please upload an image");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photoUrl", backendImage);
    try {
      const res = await axios.post(`${serverURL}/api/auth/register`, formData, {
        withCredentials: true,
      });
      console.log(res);
      setLoggedInUserData(res?.data?.user);
      navigate("/");
      showCustomAlert("Account created successfully");
    } catch (error) {
      console.log(error);
      showCustomAlert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      console.log(res);

      const user = {
        userName: res.user.displayName,
        email: res.user.email,
        photoUrl: res.user.photoURL,
      };
      const result = await axios.post(`${serverURL}/api/auth/google`, user, {
        withCredentials: true,
      });
      console.log(result);
      setLoggedInUserData(result.data);
      showCustomAlert("Login successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      showCustomAlert("Login failed");
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      showCustomAlert("Email is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/auth/send-otp-email`,
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
        `${serverURL}/api/auth/verify-otp-email`,
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

  return (
    <div className="bg-[#181818] min-h-screen flex items-center justify-center text-white">
      <div className="bg-[#202124] p-10 rounded-2xl w-full max-w-md shadow-lg">
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
              Create Your Account
            </h1>
            <form className="mt-6">
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded mb-2 transition duration-500 ease-in-out focus:outline-none focus:border-red-500"
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded mb-2 transition duration-500 ease-in-out focus:outline-none focus:border-red-500"
              />
            </form>
            <button
              onClick={handleSendOtp}
              className="w-full bg-red-500 text-white p-2 font-medium rounded-full mt-6 transition duration-300 ease-in-out cursor-pointer hover:bg-red-600"
            >
              Next
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full border-red-500 border-1 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
            >
              Already have an account?
            </button>
            <button
              onClick={handleGoogleSignIn}
              className="w-full border-red-500 border-1 flex justify-center items-center gap-2 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
            >
              <FcGoogle className="text-2xl" /> Google Sign In
            </button>
          </div>
        )}
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
              {loading ? <ClipLoader color="black" size={20} /> : "Verify OTP"}
            </button>
          </div>
        )}
        {/* step 3 */}
        {step === 3 && (
          <div>
            <h1 className="flex text-2xl items-center gap-2">
              <img src={logo} alt="logo" className="size-9" />
              Password
            </h1>
            <div className="mt-3 flex items-center bg-[#3c4043] px-4 py-2 rounded-full w-fit">
              <FaUserCircle className="mr-2 size-5" />
              {email}
            </div>
            <form className="mt-6">
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
              onClick={handleNext}
              className="w-full bg-red-500 text-white p-2 font-medium rounded-full mt-6 transition duration-300 ease-in-out cursor-pointer hover:bg-red-600"
            >
              Next
            </button>
          </div>
        )}
        {/* step 4 */}
        {step === 4 && (
          <div>
            <h1 className="flex text-2xl items-center gap-2">
              <img src={logo} alt="logo" className="size-9" />
              Profile Picture
            </h1>
            <div className="flex items-center gap-6 mb-6 mt-5">
              <div className="size-28 rounded-full border-gray-500 overflow-hidden shadow-lg">
                {/* if frontend image available show it, else show default icon */}
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    alt="profile"
                    className="size-28 object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-gray-500 w-full h-full p-2" />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="">Upload Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600 cursor-pointer"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-red-500 text-white p-2 font-medium rounded-full mt-6 transition duration-300 ease-in-out cursor-pointer hover:bg-red-600 ${
                loading ? "cursor-not-allowed" : ""
              } ${loading ? "opacity-50" : ""}}`}
            >
              {loading ? (
                <ClipLoader color="black" size={20} />
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
