import { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "../../App";
import { ClipLoader } from "react-spinners";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useChannelStore } from "../../store/useChannelStore";

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getUserChannel } = useChannelStore();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;
      setInitialLoading(true);
      try {
        const res = await axios.get(
          `${serverURL}/api/content/fetchPost/${postId}`,
          { withCredentials: true }
        );
        console.log(res.data);

        setContent(res.data?.content || "");
        setImageUrl(res.data?.image || null);
      } catch (error) {
        console.log("Error fetching post:", error);
        showCustomAlert("Failed to load post data", "error");
        navigate("/yt-studio/content");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPostData();
  }, [postId, navigate]);

  const handleUpdate = async () => {
    if (!content.trim()) {
      showCustomAlert("Content cannot be empty", "warning");
      return;
    }
    setLoading(true);
    try {
      const updateData = { content };

      const res = await axios.put(
        `${serverURL}/api/content/updatePost/${postId}`,
        updateData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(res.data);

      await getUserChannel();

      showCustomAlert("Post Updated Successfully", "success");
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
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    )
      return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(
        `${serverURL}/api/content/deletePost/${postId}`,
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      await getUserChannel();

      showCustomAlert("Post deleted successfully", "success");
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
            Update Post Details
          </h2>

          {imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden border border-neutral-700 flex justify-center bg-black">
              <img
                src={imageUrl}
                alt="Post image"
                className="w-full md:w-auto md:max-h-[300px] h-auto object-contain"
              />
            </div>
          )}

          <textarea
            placeholder="Write something..."
            value={content}
            rows={6}
            className="w-full p-3 rounded-lg bg-[#121212] border border-neutral-700 text-white focus:ring-1 focus:ring-red-600 focus:outline-none resize-none"
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleUpdate}
              disabled={
                loading || deleteLoading || initialLoading || !content.trim()
              }
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center py-2.5 rounded-full transition duration-200 ${
                loading || deleteLoading || initialLoading || !content.trim()
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : "Update Post"}
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
                "Delete Post"
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

export default UpdatePost;
