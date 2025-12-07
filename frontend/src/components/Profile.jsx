import { useEffect, useRef } from "react";
import { useUserStore } from "../store/useUserStore";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "../components/CustomAlert";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import axios from "axios";
import { serverURL } from "../App";

const Profile = ({ setToggle }) => {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const {
    loggedInUserData,
    logout,
    setLoggedInUserData,
    getCurrentLoggedInUser,
  } = useUserStore();

  const logoutHandler = async () => {
    await logout();
    navigate("/");
    showCustomAlert("Logout successfully");
    setToggle(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = {
        userName: res.user.displayName,
        email: res.user.email,
        photoUrl: res.user.photoURL,
      };
      const result = await axios.post(`${serverURL}/api/auth/google`, user, {
        withCredentials: true,
      });
      setLoggedInUserData(result.data);
      showCustomAlert("Login successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      showCustomAlert("Login failed");
    } finally {
      setToggle(false);
    }
  };

  useEffect(() => {
    getCurrentLoggedInUser();
  }, [getCurrentLoggedInUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setToggle]);

  return (
    <div ref={profileRef}>
      <div className="hidden md:block absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50">
        {loggedInUserData && (
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <img
              src={loggedInUserData?.photoUrl}
              alt=""
              className="size-12 flex items-center justify-center rounded-full object-cover border-1 border-gray-700"
            />
            <div>
              <h4 className="font-medium">{loggedInUserData?.userName}</h4>
              <p className="text-xs text-gray-400">{loggedInUserData?.email}</p>
              <p
                className="text-xs text-blue-400 cursor-pointer hover:underline"
                onClick={() => {
                  loggedInUserData?.channel
                    ? navigate("/view-channel")
                    : navigate("/create-channel");
                  setToggle(false);
                }}
              >
                {loggedInUserData?.channel ? "View Channel" : "Create Channel"}
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col py-2">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-zinc-700 transition duration-300"
          >
            <FcGoogle className="text-2xl" /> Google Sign In
          </button>
          <button
            onClick={() => {
              navigate("/register");
              setToggle(false);
            }}
            className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-zinc-700 transition duration-300"
          >
            <TiUserAddOutline className="text-2xl" /> Create New Account
          </button>
          <button
            onClick={() => {
              navigate("/login");
              setToggle(false);
            }}
            className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-zinc-700 transition duration-300"
          >
            <MdOutlineSwitchAccount className="text-2xl" /> Switch Account
          </button>
          {loggedInUserData?.channel && (
            <button
              onClick={() => {
                navigate("/yt-studio/dashboard");
                setToggle(false);
              }}
              className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-zinc-700 transition duration-300"
            >
              <SiYoutubestudio className="text-2xl" /> YouTube Studio
            </button>
          )}
          {loggedInUserData && (
            <button
              onClick={logoutHandler}
              className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-zinc-700 transition duration-300"
            >
              <FiLogOut className="text-2xl" /> Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
