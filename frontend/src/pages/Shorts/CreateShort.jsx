import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverURL } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";
import { useChannelStore } from "../../store/useChannelStore";
import { useNavigate } from "react-router-dom";
import { useContentStore } from "../../store/useContentStore";

const CreateShort = () => {
  const navigate = useNavigate();
  const { channelData, setChannelData } = useChannelStore();
  const { shorts, setShorts } = useContentStore();
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const uploadShort = async () => {
    if (!title || !shortUrl) {
      alert("Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      const shortData = new FormData();
      shortData.append("short", shortUrl);
      shortData.append("title", title);
      shortData.append("description", description);
      shortData.append(
        "tags",
        JSON.stringify(tags.split(",").map((tag) => tag.trim()))
      );
      shortData.append("channelId", channelData._id);

      const response = await axios.post(
        `${serverURL}/api/content/create-short`,
        shortData,
        { withCredentials: true }
      );
      console.log(response.data);
      setShorts([...shorts, response.data]);
      const updateChannelShortsField = {
        ...channelData,
        shorts: [...(channelData.shorts || []), response.data._id],
      };
      setChannelData(updateChannelShortsField);
      showCustomAlert("Short uploaded successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      showCustomAlert("Failed to upload short");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[75vh] bg-[#0f0f0f] text-white flex flex-col">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Left Side */}
          <div className="flex justify-center items-center">
            <label
              htmlFor="short"
              className="flex flex-col hover:border-red-600 transition duration-300 items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-[#181818] overflow-hidden w-[220px] aspect-[9/16]"
            >
              {shortUrl ? (
                <video
                  src={URL.createObjectURL(shortUrl)}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <FaCloudUploadAlt size={40} color="gray" />
                  <p className="text-gray-300 text-xs text-center px-2">
                    Click to Upload
                  </p>
                  <span className="text-[10px] text-gray-500">
                    MP4 or MOV - Max 60 seconds
                  </span>
                </div>
              )}
              <input
                onChange={(e) => setShortUrl(e.target.files[0])}
                type="file"
                id="short"
                className="hidden"
                accept="video/mp4,video/quicktime"
              />
            </label>
          </div>
          {/* Right Side */}
          <div className="flex flex-col space-y-4">
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              value={title}
              placeholder="Title..."
              className="w-full p-3 rounded-lg border border-gray-700 focus:outline-none bg-[#121212] focus:ring-2 focus:ring-red-600"
            />
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="Description..."
              className="w-full p-3 rounded-lg border border-gray-700 focus:outline-none resize-none bg-[#121212] focus:ring-2 focus:ring-red-600"
            />
            <input
              onChange={(e) => setTags(e.target.value)}
              type="text"
              value={tags}
              placeholder="Tags!"
              className="w-full p-3 rounded-lg border border-gray-700 focus:outline-none bg-[#121212] focus:ring-2 focus:ring-red-600"
            />
            <button
              onClick={uploadShort}
              disabled={!title || !shortUrl || loading}
              className={`w-full bg-red-600 hover:bg-red-700 font-medium flex items-center justify-center py-3 rounded-full ${
                !title || !shortUrl || loading
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {loading ? (
                <ClipLoader color="black" size={20} />
              ) : (
                "Upload Short"
              )}
            </button>
            {loading && (
              <div className="text-center text-gray-300 text-sm animate-pulse">
                Uploading... Please wait...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateShort;
