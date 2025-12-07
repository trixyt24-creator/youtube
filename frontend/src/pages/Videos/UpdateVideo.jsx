import { useState, useEffect } from "react";
import axios from "axios";
import { useChannelStore } from "../../store/useChannelStore";
import { serverURL } from "../../App";
import { ClipLoader } from "react-spinners";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useContentStore } from "../../store/useContentStore";

const UpdateVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { setVideos } = useContentStore(); 
  const { getUserChannel } = useChannelStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;
      try {
        const res = await axios.get(
          `${serverURL}/api/content/fetchVideo/${videoId}`,
          { withCredentials: true }
        );
        setTitle(res.data?.title || "");
        setDescription(res.data?.description || "");
        setTags(res.data?.tags.join(", ") || "");
        setThumbnailPreviewUrl(res.data?.thumbnail || null);
      } catch (error) {
        console.log("Error fetching video:", error);
        showCustomAlert("Failed to load video data", "error");
        navigate(-1);
      }
    };
    fetchVideo();
  }, [videoId, navigate]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!title) {
      showCustomAlert("Title is required", "warning");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      const parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(parsedTags));

      if (newThumbnailFile) {
        formData.append("thumbnail", newThumbnailFile);
      }

      const res = await axios.put(
        `${serverURL}/api/content/updateVideo/${videoId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      await getUserChannel();
      
      setVideos((prevVideos) =>
        prevVideos.map((video) => (video._id === videoId ? res.data : video))
      );

      showCustomAlert("Video Updated Successfully", "success");
      navigate(-1);
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
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    )
      return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${serverURL}/api/content/deleteVideo/${videoId}`, {
        withCredentials: true,
      });

      await getUserChannel();

      setVideos((prevVideos) =>
        prevVideos.filter((video) => video._id !== videoId)
      );
      showCustomAlert("Video deleted successfully", "success");
      navigate(-1);
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

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col md:pt-5">
      <div className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#181818] border border-neutral-800 p-6 rounded-xl shadow-lg space-y-5 w-full max-w-xl">
          <h2 className="text-xl font-semibold text-center mb-4">
            Update Video Details
          </h2>
          <input
            type="text"
            placeholder="Title (Required)"
            value={title}
            className="w-full p-3 rounded-lg bg-[#121212] border border-neutral-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            rows={4}
            className="w-full p-3 rounded-lg bg-[#121212] border border-neutral-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none resize-none"
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags"
            value={tags}
            className="w-full p-3 rounded-lg bg-[#121212] border border-neutral-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none"
            onChange={(e) => setTags(e.target.value)}
          />

          <label
            htmlFor="thumbnail"
            className="cursor-pointer block text-sm font-medium text-gray-400 mb-2"
          >
            Change Thumbnail
          </label>
          <div className="w-full aspect-video bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-700 mb-2">
            {thumbnailPreviewUrl ? (
              <img
                src={thumbnailPreviewUrl}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">Current Thumbnail</span>
            )}
          </div>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
            onChange={handleThumbnailChange}
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleUpdate}
              disabled={loading || deleteLoading}
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center py-2.5 rounded-full transition duration-200 ${
                loading || deleteLoading
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : "Update Video"}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || deleteLoading}
              className={`w-full border border-red-600 text-red-500 hover:bg-red-600/10 font-medium flex items-center justify-center py-2.5 rounded-full transition duration-200 ${
                loading || deleteLoading
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {deleteLoading ? (
                <ClipLoader color="#FF0000" size={20} />
              ) : (
                "Delete Video"
              )}
            </button>
          </div>

          {loading && (
            <div className="text-center text-gray-400 text-xs animate-pulse">
              Updating... Please wait...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateVideo;