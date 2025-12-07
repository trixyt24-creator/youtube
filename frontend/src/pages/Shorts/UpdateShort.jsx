import { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "../../App";
import { ClipLoader } from "react-spinners";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useContentStore } from "../../store/useContentStore";
import { useChannelStore } from "../../store/useChannelStore";

const UpdateShort = () => {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const { setShorts } = useContentStore();
  const { getUserChannel } = useChannelStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchShort = async () => {
      if (!shortId) return;
      setInitialLoading(true);
      try {
        const res = await axios.get(
          `${serverURL}/api/content/fetchShort/${shortId}`,
          { withCredentials: true }
        );
        setTitle(res.data?.title || "");
        setDescription(res.data?.description || "");
        setTags(res.data?.tags.join(", ") || "");
        setShortUrl(res.data?.shortUrl || "");
      } catch (error) {
        console.log("Error fetching short:", error);
        showCustomAlert("Failed to load short data", "error");
        navigate(-1);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchShort();
  }, [shortId, navigate]);

  const handleUpdate = async () => {
    if (!title) {
      showCustomAlert("Title is required", "warning");
      return;
    }
    setLoading(true);
    try {
      const updateData = {
        title,
        description,
        tags: JSON.stringify(
          tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        ),
      };

      const res = await axios.put(
        `${serverURL}/api/content/updateShort/${shortId}`,
        updateData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      await getUserChannel();
      setShorts((prevShorts) =>
        prevShorts.map((short) => (short._id === shortId ? res.data : short))
      );

      showCustomAlert("Short Updated Successfully");
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
        "Are you sure you want to delete this short? This action cannot be undone."
      )
    )
      return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${serverURL}/api/content/deleteShort/${shortId}`, {
        withCredentials: true,
      });
      await getUserChannel();
      setShorts((prevShorts) =>
        prevShorts.filter((short) => short._id !== shortId)
      );
      showCustomAlert("Short deleted successfully");
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
        <ClipLoader color="#fff" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-[60px] md:pt-5">
      <div className="flex flex-1 justify-center items-start px-4 py-6">
        <div className="bg-[#181818] border border-neutral-800 p-6 rounded-xl shadow-lg space-y-5 w-full max-w-xl">
          <h2 className="text-xl font-semibold text-center mb-4">
            Update Short Details
          </h2>

          {shortUrl && (
            <div className="w-full max-w-[250px] mx-auto aspect-[9/16] bg-black rounded-lg overflow-hidden border border-neutral-700 mb-4">
              <video
                src={shortUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          )}

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
              {loading ? <ClipLoader color="#fff" size={20} /> : "Update Short"}
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
              {deleteLoading ? (
                <ClipLoader color="#FF0000" size={20} />
              ) : (
                "Delete Short"
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

export default UpdateShort;
