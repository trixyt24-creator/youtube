import { useChannelStore } from "../store/useChannelStore";
import { useNavigate } from "react-router-dom";
import { FaComment, FaEye, FaThumbsUp } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const { channelData } = useChannelStore();
  const totalVideoViews = (channelData?.videos || []).reduce(
    (acc, vid) => acc + (vid.views || 0),
    0
  );
  const totalShortViews = (channelData?.shorts || []).reduce(
    (acc, sid) => acc + (sid.views || 0),
    0
  );
  const totalViews = totalVideoViews + totalShortViews;
  return (
    <div className="w-full text-white min-h-screen p-4 sm:p-6 space-y-6 mb-[50px]">
      <div className="flex flex-col md:flex-row items-center gap-4 md:items-start">
        <img
          src={channelData?.avatar}
          alt=""
          className="size-22 border border-gray-600 object-cover rounded-full shadow-md hover:border-gray-400 transition duration-300 ease-in-out cursor-pointer"
        />
        <div className="text-center md:text-left mt-[2%] flex flex-col items-center md:items-start">
          <h2 className="text-base lg:text-lg font-semibold">
            {channelData?.name}
          </h2>
          <p className="text-xs text-gray-400">
            {channelData?.subscribers?.length || 0} subscribers
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 sm:gap-4 gap-3">
        <AnalyticsCard
          label="Total Views"
          value={totalViews || 0}
          onClick={() => {
            navigate("/yt-studio/analytics");
          }}
        />
        <AnalyticsCard
          label="Total Videos"
          value={channelData?.videos?.length || 0}
          onClick={() => {
            navigate("/yt-studio/analytics");
          }}
        />
        <AnalyticsCard
          label="Total Shorts"
          value={channelData?.shorts?.length || 0}
          onClick={() => {
            navigate("/yt-studio/analytics");
          }}
        />
        <AnalyticsCard
          label="Total Subscribers"
          value={channelData?.subscribers?.length || 0}
          onClick={() => {
            navigate("/yt-studio/analytics");
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-3 mt-5">
        <div>
          {channelData?.videos?.length > 0 && (
            <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
              Latest Videos
            </h3>
          )}
          <div className="space-y-4">
            {(channelData?.videos)
              ?.slice()
              .reverse()
              .slice(0, 5)
              .map((video, idx) => (
                <VideoCard
                  key={idx}
                  content={video}
                  onClick={() => navigate(`/play-video/${video._id}`)}
                />
              ))}
          </div>
        </div>
        <div>
          {channelData?.shorts?.length > 0 && (
            <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
              Latest Shorts
            </h3>
          )}
          <div className="space-y-4">
            {(channelData?.shorts)
              ?.slice()
              .reverse()
              .slice(0, 5)
              .map((short, idx) => (
                <ShortCard
                  key={idx}
                  content={short}
                  onClick={() => navigate(`/play-short/${short._id}`)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function AnalyticsCard({ label, value, onClick }) {
  return (
    <div
      className="bg-[#0f0f0f] border border-gray-700 cursor-pointer hover:border-gray-400 rounded-lg p-3 sm:p-4 shadow hover:shadow-lg transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-2">
        {label}
      </div>
      <h4 className="text-lg sm:text-xl text-start font-semibold">{value}</h4>
    </div>
  );
}

function VideoCard({ content, onClick }) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition"
      onClick={onClick}
    >
      <img
        src={content?.thumbnail}
        alt=""
        className="w-full sm:w-40 h-48 sm:h-24 rounded-lg object-cover"
      />
      <div className="flex-1">
        <div className="w-[100%] flex flex-col items-start justify-center gap-2">
          <h4 className="font-semibold text-sm sm:text-base line-clamp-3">
            {content?.title}
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Published {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm">
          <span className="flex items-center gap-1">
            <FaEye /> {content?.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp /> {content?.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment /> {content?.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function ShortCard({ content, onClick }) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition"
      onClick={onClick}
    >
      <video
        src={content?.shortUrl}
        className="w-20 h-24 object-cover rounded-xl"
        muted
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
      ></video>
      <div className="flex-1">
        <div className="w-[100%] flex flex-col items-start justify-center gap-2">
          <h4 className="font-semibold text-sm sm:text-base line-clamp-3">
            {content?.title}
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Published {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm">
          <span className="flex items-center gap-1">
            <FaEye /> {content?.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp /> {content?.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment /> {content?.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
