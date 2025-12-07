import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { serverURL } from "../../App";
import { ClipLoader } from "react-spinners";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useContentStore } from "../../store/useContentStore";
import { useChannelStore } from "../../store/useChannelStore";
import { FaPlus, FaTrash } from "react-icons/fa";

const UpdatePlaylist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { videos: allVideos } = useContentStore();
  const { channelData, getUserChannel } = useChannelStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentVideoIds, setCurrentVideoIds] = useState([]);
  const [allUserVideos, setAllUserVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!playlistId) return;
      setInitialLoading(true);
      try {
        const res = await axios.get(
          `${serverURL}/api/content/fetchPlaylist/${playlistId}`,
          { withCredentials: true }
        );
        setTitle(res.data?.title || "");
        setDescription(res.data?.description || "");
        setCurrentVideoIds(res.data?.videos?.map((v) => v._id) || []);
      } catch (error) {
        console.log("Error fetching playlist:", error);
        showCustomAlert("Failed to load playlist data", "error");
        navigate("/yt-studio/content");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPlaylistData();
  }, [playlistId, navigate]);

  useEffect(() => {
    if (allVideos && channelData) {
      setAllUserVideos(
        allVideos && allVideos?.filter((v) => v.channel?._id === channelData._id)
      );
    }
  }, [allVideos, channelData]);

  const videosInPlaylist = useMemo(() => {
    return allUserVideos.filter((v) => currentVideoIds.includes(v._id));
  }, [allUserVideos, currentVideoIds]);
  const videosNotInPlaylist = useMemo(() => {
    return allUserVideos.filter((v) => !currentVideoIds.includes(v._id));
  }, [allUserVideos, currentVideoIds]);

  const handleAddVideo = (videoId) => {
    setCurrentVideoIds((prev) => [...prev, videoId]);
  };
  const handleRemoveVideo = (videoId) => {
    setCurrentVideoIds((prev) => prev.filter((id) => id !== videoId));
  };

  const handleUpdate = async () => {
    if (!title) {
      showCustomAlert("Title is required", "warning");
      return;
    }
    setLoading(true);
    try {
      const updateData = { title, description, videoIds: currentVideoIds };

      await axios.put(
        `${serverURL}/api/content/updatePlaylist/${playlistId}`,
        updateData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      await getUserChannel();

      showCustomAlert("Playlist Updated Successfully", "success");
      navigate("/yt-studio/content");
    } catch (error) {
      console.log("Update error:", error);
      showCustomAlert(
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this playlist? This action cannot be undone."
      )
    )
      return;
    setDeleteLoading(true);
    try {
      await axios.delete(
        `${serverURL}/api/content/deletePlaylist/${playlistId}`,
        {
          withCredentials: true,
        }
      );
      await getUserChannel();

      showCustomAlert("Playlist deleted successfully", "success");
      navigate("/yt-studio/content");
    } catch (error) {
      console.log("Delete error:", error);
      showCustomAlert(
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full min-h-[50vh] bg-[#0f0f0f] text-white flex justify-center items-center">
        {" "}
        <ClipLoader color="#fff" size={40} />{" "}
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-[60px] md:pt-5">
      <div className="flex flex-1 justify-center items-start px-4 py-6">
        <div className="bg-[#181818] border border-neutral-800 p-6 rounded-xl shadow-lg space-y-5 w-full max-w-3xl">
          <h2 className="text-xl font-semibold text-center mb-4">
            Update Playlist Details
          </h2>
          {/* Title and Description Inputs */}
          <input
            type="text"
            placeholder="Title (Required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-neutral-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-neutral-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none resize-none"
          />

          {/* Video Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Videos In Playlist */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-300">
                Videos in Playlist ({videosInPlaylist.length})
              </h3>
              <div className="bg-[#121212] border border-neutral-700 rounded-lg p-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent space-y-2">
                {videosInPlaylist.length > 0 ? (
                  videosInPlaylist.map((video) => (
                    <div
                      key={video._id}
                      className="flex items-center gap-3 p-2 bg-neutral-800 rounded"
                    >
                      {" "}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-9 object-cover rounded flex-shrink-0"
                      />{" "}
                      <span className="text-xs text-white truncate flex-grow">
                        {video.title}
                      </span>{" "}
                      <button
                        onClick={() => handleRemoveVideo(video._id)}
                        className="p-1.5 rounded-full text-red-500 hover:bg-red-500/10 flex-shrink-0"
                      >
                        <FaTrash size={14} />
                      </button>{" "}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No videos in playlist.
                  </p>
                )}
              </div>
            </div>
            {/* Available Videos */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-300">
                Available Videos ({videosNotInPlaylist.length})
              </h3>
              <div className="bg-[#121212] border border-neutral-700 rounded-lg p-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent space-y-2">
                {videosNotInPlaylist.length > 0 ? (
                  videosNotInPlaylist.map((video) => (
                    <div
                      key={video._id}
                      className="flex items-center gap-3 p-2 bg-neutral-800 rounded"
                    >
                      {" "}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-9 object-cover rounded flex-shrink-0"
                      />{" "}
                      <span className="text-xs text-white truncate flex-grow">
                        {video.title}
                      </span>{" "}
                      <button
                        onClick={() => handleAddVideo(video._id)}
                        className="p-1.5 rounded-full text-green-500 hover:bg-green-500/10 flex-shrink-0"
                      >
                        <FaPlus size={14} />
                      </button>{" "}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No other videos available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleUpdate}
              disabled={loading || deleteLoading || initialLoading}
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center py-2.5 rounded-full transition duration-200 ${
                loading || deleteLoading || initialLoading
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {" "}
              {loading ? (
                <ClipLoader color="#fff" size={20} />
              ) : (
                "Update Playlist"
              )}{" "}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || deleteLoading || initialLoading}
              className={`w-full border border-red-600 text-red-500 hover:bg-red-600/10 font-medium flex items-center justify-center py-2.5 rounded-full transition duration-200 ${
                loading || deleteLoading || initialLoading
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {" "}
              {deleteLoading ? (
                <ClipLoader color="#FF0000" size={20} />
              ) : (
                "Delete Playlist"
              )}{" "}
            </button>
          </div>
          {loading && (
            <div className="text-center text-gray-400 text-xs animate-pulse">
              {" "}
              Updating... Please wait...{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePlaylist;
