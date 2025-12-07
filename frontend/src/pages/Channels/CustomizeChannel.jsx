import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";
import { useChannelStore } from "../../store/useChannelStore";
import { ClipLoader } from "react-spinners";
import { useUserStore } from "../../store/useUserStore";

const CustomizeChannel = () => {
  const navigate = useNavigate();
  const { setLoggedInUserData } = useUserStore();
  const { channelData, setChannelData } = useChannelStore();
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(channelData?.avatar);
  const [channelName, setChannelName] = useState(channelData?.name);
  const [description, setDescription] = useState(channelData?.description);
  const [category, setCategory] = useState(channelData?.category);
  const [banner, setBanner] = useState(channelData?.banner);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (channelData) {
      setChannelName(channelData.name);
      setAvatar(channelData.avatar);
      setBanner(channelData.banner);
      setDescription(channelData.description);
      setCategory(channelData.category);
    }
  }, [channelData]);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleBanner = (e) => {
    const file = e.target.files[0];
    setBanner(file);
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(step + 1);
    } else if (step === 2) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(step - 1);
    } else if (step === 3) {
      setStep(step - 1);
    }
  };

  const avatarSrc =
    typeof avatar === "string"
      ? avatar // If it's a string, use it directly as the URL
      : avatar instanceof File
      ? URL.createObjectURL(avatar) // If it's a File object, create an object URL
      : null; // Otherwise, there's no source

  const bannerSrc =
    typeof banner === "string"
      ? banner // If it's a string, use it directly as the URL
      : banner instanceof File
      ? URL.createObjectURL(banner) // If it's a File object, create an object URL
      : null; // Otherwise, there's no source

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", channelName);
      formData.append("avatar", avatar);
      formData.append("banner", banner);
      formData.append("description", description);
      formData.append("category", category);

      const response = await axios.post(
        `${serverURL}/api/user/customize-channel`,
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      setChannelData(response.data);
      setLoggedInUserData(response.data?.owner);
      navigate("/view-channel");
      showCustomAlert("Channel updated successfully");
    } catch (error) {
      console.log(error);
      showCustomAlert(error?.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#0f0f0f] w-full min-h-screen flex flex-col text-white">
      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-lg shadow-lg">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-medium mb-4">
                How you're appearing
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Update profile picture & Channel name
              </p>
              <div className="flex flex-col items-center my-8">
                <label
                  htmlFor="avatar"
                  className="flex items-center flex-col cursor-pointer"
                >
                  {avatar ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      className="size-20 rounded-full object-cover border-2 border-gray-600"
                    />
                  ) : (
                    <div className="size-20 rounded-full object-cover border-2 border-gray-400 flex items-center justify-center">
                      <FaUserCircle size={40} />
                    </div>
                  )}
                  <span className="text-red-500 text-sm mt-2">
                    Update Picture
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    id="avatar"
                    onChange={handleAvatar}
                  />
                </label>
              </div>
              <input
                type="text"
                placeholder="Channel Name"
                className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
              <button
                disabled={!channelName || !avatar}
                className={`w-full p-2 mt-4 ${
                  !channelName || !avatar
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors`}
                onClick={handleNextStep}
              >
                Next
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full border-red-500 border-1 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
              >
                Back
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-medium mb-4">YouTube</h2>
              <div className="flex flex-col items-center my-8">
                <label className="flex items-center flex-col cursor-pointer">
                  {avatar ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      className="size-20 rounded-full object-cover border-2 border-gray-600"
                    />
                  ) : (
                    <div className="size-20 rounded-full object-cover border-2 border-gray-400 flex items-center justify-center">
                      <FaUserCircle size={40} />
                    </div>
                  )}
                  <h2 className="mt-5 text-3xl tracking-tight font-medium">
                    {channelName}
                  </h2>
                </label>
              </div>
              <button
                className={`w-full p-2  cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors`}
                onClick={handleNextStep}
              >
                Next
              </button>
              <button
                onClick={handlePreviousStep}
                className="w-full border-red-500 border-1 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
              >
                Back
              </button>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-medium mb-8">
                Customize Your Channel
              </h2>
              <div className="flex flex-col items-center my-8">
                <label htmlFor="banner" className="block w-full cursor-pointer">
                  {banner ? (
                    <img
                      src={bannerSrc}
                      alt=""
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-600"
                    />
                  ) : (
                    <div className="w-full h-32 object-cover rounded-lg hover:bg-gray-700 hover:transition-all duration-300 border-2 border-gray-600 flex items-center justify-center">
                      Click to upload Banner Image
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    id="banner"
                    onChange={handleBanner}
                  />
                </label>
              </div>
              <textarea
                placeholder="Channel's Description"
                className="w-full resize-none p-3 mb-1 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <div className="w-full">
                <select
                  className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white appearance-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option
                    value=""
                    disabled
                    className="text-gray-400 bg-[#181818]"
                  >
                    Select Channel Category
                  </option>
                  <option value="Entertainment" className="bg-[#181818]">
                    Entertainment
                  </option>
                  <option value="Comedy" className="bg-[#181818]">
                    Comedy
                  </option>
                  <option value="Gaming" className="bg-[#181818]">
                    Gaming
                  </option>
                  <option value="Vlogs" className="bg-[#181818]">
                    Vlogs & Lifestyle
                  </option>
                  <option value="Music" className="bg-[#181818]">
                    Music
                  </option>
                  <option value="Tech" className="bg-[#181818]">
                    Science & Technology
                  </option>
                  <option value="Education" className="bg-[#181818]">
                    Education
                  </option>
                  <option value="Howto" className="bg-[#181818]">
                    How-to & Style
                  </option>
                  <option value="Film" className="bg-[#181818]">
                    Film & Animation
                  </option>
                  <option value="News" className="bg-[#181818]">
                    News & Politics
                  </option>
                  <option value="Sports" className="bg-[#181818]">
                    Sports
                  </option>
                  <option value="Travel" className="bg-[#181818]">
                    Travel & Events
                  </option>
                  <option value="Pets" className="bg-[#181818]">
                    Pets & Animals
                  </option>
                  <option value="Food" className="bg-[#181818]">
                    Food & Cooking
                  </option>
                  <option value="Auto" className="bg-[#181818]">
                    Autos & Vehicles
                  </option>
                </select>
              </div>
              <button
                disabled={!category || !description || loading}
                className={`w-full p-2 mt-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors ${
                  !category || !description || loading
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={handleSubmit}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Update Channel"
                )}
              </button>
              <button
                onClick={handlePreviousStep}
                className="w-full border-red-500 border-1 hover:bg-zinc-800 text-white p-2 font-sm rounded-full mt-3 transition duration-300 ease-in-out cursor-pointer"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomizeChannel;
