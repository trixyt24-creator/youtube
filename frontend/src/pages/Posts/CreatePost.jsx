import { useState } from "react";
import { FaImage } from "react-icons/fa";
import axios from "axios";
import { useChannelStore } from "../../store/useChannelStore";
import { serverURL } from "../../App";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "../../components/CustomAlert";
import { ClipLoader } from "react-spinners";

const CreatePost = () => {
  const { channelData, setChannelData } = useChannelStore();
  const [content, setContent] = useState();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("channelId", channelData._id);
      formData.append("content", content);
      if (image) formData.append("image", image);
      const response = await axios.post(
        `${serverURL}/api/content/create-post`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setChannelData({
        ...channelData,
        communityPosts: [...channelData?.communityPosts, response.data],
      });
      setContent("");
      setImage(null);
      navigate("/view-channel");
      showCustomAlert("Post created successfully");
    } catch (error) {
      console.log(error);
      showCustomAlert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5 items-center justify-center">
      <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something for your community..."
          className="w-full bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 transition-all duration-200 resize-none p-4"
        ></textarea>

        <label
          htmlFor="image"
          className="flex items-center space-x-2 cursor-pointer"
        >
          <FaImage className="text-2xl ml-1 text-gray-300" />
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
        </label>

        {image && (
          <div className="size-72 rounded-lg overflow-hidden mt-3">
            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <button
          disabled={!content || loading}
          onClick={handleSubmit}
          className={`bg-red-600 hover:bg-red-700 transition-all duration-300 text-white px-6 py-2 rounded-full ${loading || !content ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? <ClipLoader color="black" size={20} /> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
