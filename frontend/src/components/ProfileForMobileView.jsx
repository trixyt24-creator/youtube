import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSubscriptions, MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { FaHistory, FaList } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa6";
import { GoVideo } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "./CustomAlert";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import axios from "axios";
import { serverURL } from "../App";

const ProfileForMobileView = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    getCurrentLoggedInUser();
  }, [getCurrentLoggedInUser]);

  return (
    <div className="md:hidden bg-[#0f0f0f] text-white h-[100%] w-[100%] flex flex-col pt-[75px] p-[10px]">
      {/* Top profile section */}
      {loggedInUserData && (
        <div className="p-4 flex items-center gap-4 border-b border-gray-800">
          {loggedInUserData.photoUrl && (
            <img
              src={loggedInUserData?.photoUrl}
              alt=""
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {loggedInUserData?.userName}
            </span>
            <span className="text-sm text-gray-400">
              {loggedInUserData?.email}
            </span>
            <p
              className="text-sm cursor-pointer hover:underline text-blue-400"
              onClick={() => {
                loggedInUserData?.channel
                  ? navigate("/view-channel")
                  : navigate("/create-channel");
              }}
            >
              {loggedInUserData?.channel ? "View Channel" : "Create Channel"}
            </p>
          </div>
        </div>
      )}

      {/* Authetication options */}
      <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto">
        <button
          onClick={handleGoogleSignIn}
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-xl" /> Google Sign In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
        >
          <TiUserAddOutline className="text-xl" /> Create New Account
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
        >
          <MdOutlineSwitchAccount className="text-xl" /> Switch Account
        </button>
        <button
          onClick={logoutHandler}
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
        >
          <FiLogOut className="text-xl" /> Logout
        </button>
      </div>

      {/* Proile menu items */}
      <div className="flex flex-col mt-[2vh]">
        <ProfileMenuItem
          icon={<FaHistory />}
          text="History"
          onClick={() => navigate("/history")}
        />
        <ProfileMenuItem
          icon={<FaList />}
          onClick={() => navigate("/saved-playlist")}
          text="Playlists"
        />
        <ProfileMenuItem
          icon={<FaThumbsUp />}
          onClick={() => navigate("/liked-content")}
          text="Liked Videos"
        />
        <ProfileMenuItem
          icon={<GoVideo />}
          onClick={() => navigate("/saved-content")}
          text="Saved Videos"
        />
        <ProfileMenuItem
          onClick={() => navigate("/yt-studio/dashboard")}
          icon={<SiYoutubestudio />}
          text="YouTube Studio"
        />
        <ProfileMenuItem
          icon={<MdOutlineSubscriptions />}
          text="Subscriptions"
          onClick={() => navigate("/subscriptions")}
        />
      </div>
    </div>
  );
};

const ProfileMenuItem = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center active:rounded-xl gap-3 p-4 active:bg-[#272727] text-left"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
};

export default ProfileForMobileView;
