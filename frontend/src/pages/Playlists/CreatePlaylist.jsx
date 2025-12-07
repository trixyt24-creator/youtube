import { useState } from "react";
import { useEffect } from "react";
import { useContentStore } from "../../store/useContentStore";
import axios from "axios";
import { serverURL } from "../../App";
import { useChannelStore } from "../../store/useChannelStore";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "../../components/CustomAlert";
import { ClipLoader } from "react-spinners";

const CreatePlaylist = () => {
  const { videos } = useContentStore();
  const { channelData, setChannelData } = useChannelStore();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [videosData, setVideosData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (videos) {
      setVideosData(videos);
    }
  }, [videos]);

  const createPlaylist = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/content/create-playlist`,
        {
          title,
          description,
          channelId: channelData?._id,
          videoIds: selectedVideos,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      setChannelData({
        ...channelData,
        playlists: [...channelData?.playlists, res.data],
      });
      setTitle("");
      setDescription("");
      setSelectedVideos([]);
      navigate("/view-channel");
      showCustomAlert("Playlist created successfully");
    } catch (error) {
      console.log(error);
      showCustomAlert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoSelect = (videoId) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter((id) => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#3b3b3b] outline-none focus:ring-1 focus:ring-[#ff0000]"
          />
          <textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#3b3b3b] outline-none focus:ring-1 focus:ring-[#ff0000] resize-none"
          ></textarea>
          <div>
            <p className=" mb-3 text-lg font-semibold">Select Videos</p>
            {videosData?.length === 0 ? (
              <p className="text-sm text-gray-400">No videos available</p>
            ) : (
              <>
                <div className="scrollbar-hide grid grid-cols-2 gap-4 max-h-72 overflow-y-auto scrollbar-hide">
                  {videosData?.map((video) => {
                    return (
                      video?.channel?._id === channelData?._id && (
                        <div
                          key={video?._id}
                          className={`cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-2 ${
                            selectedVideos.includes(video._id)
                              ? "border-[#ff0000]"
                              : "border-[#3b3b3b]"
                          }`}
                          onClick={() => toggleVideoSelect(video._id)}
                        >
                          <img
                            src={video?.thumbnail}
                            alt=""
                            className="w-full h-28 object-cover"
                          />
                          <p className="p-2 text-sm truncate">{video?.title}</p>
                        </div>
                      )
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <button
            onClick={createPlaylist}
            disabled={!title || selectedVideos.length === 0}
            className={`w-full p-3 rounded-full bg-[#ff0000] hover:bg-[#ff0000]/80 text-white font-semibold ${
              loading || !title || selectedVideos.length === 0
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {loading ? (
              <ClipLoader color="black" size={20} />
            ) : (
              "Create Playlist"
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePlaylist;
