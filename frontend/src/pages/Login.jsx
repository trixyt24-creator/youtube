import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/yt_icon.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "../components/CustomAlert";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverURL } from "../App";
import { useUserStore } from "../store/useUserStore";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();

  const { setLoggedInUserData } = useUserStore();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  // email & password fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // handling next button
  const handleNext = () => {
    if (step == 1) {
      if (!email) {
        showCustomAlert("Please fill all the fields");
        return;
      }
    } else if (step == 2) {
      if (!password) {
        showCustomAlert("Please fill all the fields");
        return;
      }
    }
    setStep(step + 1);
  };

  // handling submit button
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      navigate("/");
      setLoggedInUserData(res?.data?.user);
      showCustomAlert("Login successfull");
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
              Login
            </h1>

            <form className="mt-6">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded mb-2 transition duration-500 ease-in-out focus:outline-none focus:border-red-500"
              />
            </form>

            <button
              onClick={handleNext}
              className="w-full bg-red-500 text-white p-2 font-medium rounded-full mt-6 transition duration-300 ease-in-out cursor-pointer hover:bg-red-600"
            >
              Next
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full border-red-500 border-1 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
            >
              Create New Account
            </button>
            <button
              onClick={handleGoogleSignIn}
              className="w-full border-red-500 border-1 flex justify-center items-center gap-2 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
            >
              <FcGoogle className="text-2xl" /> Google Sign In
            </button>
          </div>
        )}
        {/* step 2 */}
        {step === 2 && (
          <div>
            <h1 className="flex text-2xl items-center gap-2">
              <img src={logo} alt="logo" className="size-9" />
              Welcome Back!
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
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-red-500 text-white p-2 font-medium rounded-full mt-6 transition duration-300 ease-in-out cursor-pointer hover:bg-red-600"
            >
              {loading ? <ClipLoader color="black" size={20} /> : "Login"}
            </button>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full border-red-500 border-1 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
