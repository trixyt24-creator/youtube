import { useChannelStore } from "../../store/useChannelStore";
import createVideosIcon from "../../assets/createVideosIcon.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ViewChannel = () => {
  const { channelData, getUserChannel } = useChannelStore();

  const navigate = useNavigate();

  useEffect(() => {
    getUserChannel();
  }, [getUserChannel]);

  return (
    <div className="flex flex-col gap-3">
      {/* Youtube banner */}
      <div className="w-full h-30 bg-gray-700 relative rounded-lg border-1 border-gray-600">
        {channelData?.banner ? (
          <img
            src={channelData?.banner}
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 rounded-lg"></div>
        )}
      </div>
      {/* Channel Info */}
      <div className="px-10 py-2">
        <div className="flex flex-col items-center gap-2">
          <img
            src={channelData?.avatar}
            alt=""
            className="w-20 h-20 object-cover border-1 border-gray-600 rounded-full"
          />
          <h2 className="font-medium text-2xl tracking-tighter mt-2">
            {channelData?.name}
          </h2>
          <p className="text-sm text-gray-400">{channelData?.owner?.email}</p>
          <p className="text-sm text-gray-400 mb-2">
            More about this Channel...{" "}
            <span className="text-red-500 font-medium cursor-pointer hover:underline">
              View
            </span>
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/customize-channel")}
              className="px-4 py-2 bg-gray-100 cursor-pointer text-black rounded-full hover:bg-gray-300 transition-colors"
            >
              Customize Channel
            </button>
            <button
              onClick={() => navigate("/yt-studio/dashboard")}
              className="px-4 py-2 bg-gray-600 cursor-pointer text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              Manage Videos
            </button>
          </div>
        </div>
        <div className="flex flex-col tracking-tight items-center">
          <img src={createVideosIcon} alt="" className="size-30" />
          <p className="font-medium text-2xl">Create Content on Any Device!!</p>
          <p className="text-gray-400 text-sm text-center">
            Upload & Record at Home or on the go. Everything you make will
            appear here!!
          </p>
          <button
            onClick={() => navigate("/create-content")}
            className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-full hover:bg-red-700 transition-colors mt-5"
          >
            + Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewChannel;
