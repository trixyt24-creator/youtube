import { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark, FaListUl, FaTimes } from "react-icons/fa";
import VideoCard from "./VideoCard";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";
import { serverURL } from "../App";
import  getVideoDuration  from "./GetVideoDuration";

const PlaylistCard = ({ id, title, videos = [], savedBy = [] }) => {
  const { loggedInUserData } = useUserStore();
  const thumbnail = videos[0]?.thumbnail;

  const [open, setOpen] = useState(false);
  const [durations, setDurations] = useState({});
  const [currentSavedBy, setCurrentSavedBy] = useState(savedBy);

  const isSaved = currentSavedBy.includes(loggedInUserData?._id);

  useEffect(() => {
    if (Array.isArray(videos) && videos.length > 0) {
      videos.forEach((video) => {
        if (video?.videoUrl) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDurations((prev) => ({ ...prev, [video._id]: formattedTime }));
          });
        }
      });
    }
  }, [videos]);

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!loggedInUserData) return;

    const playlistId = id;
    const originalSavedBy = currentSavedBy;

    if (isSaved) {
      setCurrentSavedBy(
        originalSavedBy.filter((userId) => userId !== loggedInUserData._id)
      );
    } else {
      setCurrentSavedBy([...originalSavedBy, loggedInUserData._id]);
    }

    try {
      const res = await axios.put(
        `${serverURL}/api/content/playlist/toggleSavedBy`,
        { playlistId },
        { withCredentials: true }
      );
      console.log(res.data);
    } catch (error) {
      console.log("Failed to update save status:", error);
      setCurrentSavedBy(originalSavedBy);
    }
  };

  return (
    <>
      <div className="relative w-full sm:w-64 h-40 rounded-xl overflow-hidden group shadow-lg bg-neutral-900 cursor-pointer">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
          <h3 className="font-semibold text-white truncate">{title}</h3>
          <p className="text-gray-400 text-sm">{videos.length} videos</p>
        </div>

        <button
          onClick={handleToggleSave}
          className="cursor-pointer absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition duration-300"
        >
          {isSaved ? (
            <FaBookmark size={18} className="text-white" />
          ) : (
            <FaRegBookmark size={18} className="text-white" />
          )}
        </button>

        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer absolute bottom-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition duration-300"
        >
          <FaListUl size={18} className="text-white" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-[#181818] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-neutral-800">
            {/* Header section */}
            <div className="flex justify-between items-center p-4 border-b border-neutral-800 flex-shrink-0">
              <h2 className="text-lg font-semibold text-white truncate">
                {title}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer transition duration-300"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row overflow-hidden">
              {/* Left Side: Playlist Info */}
              <div className="w-full md:w-1/3 p-4 bg-[#212121] md:border-r border-neutral-800 flex-shrink-0">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full aspect-video rounded-lg mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {videos.length} videos
                </p>
                <button
                  onClick={handleToggleSave}
                  className="w-full flex items-center cursor-pointer justify-center gap-2 mt-4 px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
                >
                  {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                  <span>{isSaved ? "Saved" : "Save Playlist"}</span>
                </button>
              </div>

              {/* Right Side: Scrollable Video List */}
              <div className="w-full md:w-2/3 p-2 overflow-y-auto scrollbar-hide">
                <div className="space-y-2">
                  {videos.map((video) => (
                    <VideoCard
                      key={video._id}
                      id={video._id}
                      thumbnail={video.thumbnail}
                      title={video.title}
                      channelName={video.channel?.name}
                      channelLogo={video.channel?.avatar}
                      views={video.views}
                      duration={durations[video?._id] || "..."}
                      isHorizontal={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistCard;
