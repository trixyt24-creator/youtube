import { useState } from "react";
import axios from "axios";
import { useChannelStore } from "../../store/useChannelStore";
import { serverURL } from "../../App";
import { ClipLoader } from "react-spinners";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate } from "react-router-dom";
import { useContentStore } from "../../store/useContentStore";

const CreateVideo = () => {
  const navigate = useNavigate();
  const { channelData, setChannelData } = useChannelStore();
  const { videos, setVideos } = useContentStore();
  const [videoUrl, setVideoUrl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadVideo = async () => {
    if (!videoUrl || !thumbnail || !title) {
      alert("Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      const videoData = new FormData();
      videoData.append("video", videoUrl);
      videoData.append("thumbnail", thumbnail);
      videoData.append("title", title);
      videoData.append("description", description);
      videoData.append(
        "tags",
        JSON.stringify(tags.split(",").map((tag) => tag.trim()))
      );
      videoData.append("channelId", channelData._id);

      const response = await axios.post(
        `${serverURL}/api/content/create-video`,
        videoData,
        { withCredentials: true }
      );
      console.log(response.data);
      setVideos([...videos, response.data]);
      const updateChannelVideosField = {
        ...channelData,
        videos: [...(channelData.videos || []), response.data._id],
      };
      setChannelData(updateChannelVideosField);
      showCustomAlert("Video uploaded successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      showCustomAlert("Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[50vh] bg-[#0f0f0f] text-white flex flex-col">
      <div className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl shadow-lg space-y-6 w-full max-w-xl">
          {/* Upload Video */}
          <label
            htmlFor="video"
            className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center p-1 flex-col hover:border-red-600 transition"
          >
            <input
              type="file"
              id="video"
              accept="video/*"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none"
              onChange={(e) => setVideoUrl(e.target.files[0])}
            />
          </label>

          {/* Upload Title, Description, Tags*/}
          <input
            type="text"
            placeholder="Title..."
            value={title}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description..."
            value={description}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none resize-none"
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags!"
            value={tags}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none"
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Upload Thumbnail */}
          <label htmlFor="thumbnail" className="cursor-pointer block">
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt=""
                className="w-full rounded-lg border border-gray-700 mb-2 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-2xl cursor-pointer">
                Upload Thumbnail
              </div>
            )}
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </label>
          <button
            onClick={uploadVideo}
            disabled={!title || !videoUrl || !thumbnail || loading}
            className={`w-full bg-red-600 hover:bg-red-700 font-medium flex items-center justify-center py-3 rounded-full ${
              !title || !videoUrl || !thumbnail || loading
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {loading ? <ClipLoader color="black" size={20} /> : "Upload Video"}
          </button>
          {loading && (
            <div className="text-center text-gray-300 text-sm animate-pulse">
              Uploading... Please wait...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateVideo;
