import { useNavigate } from "react-router-dom";

const ShortCard = ({ shortUrl, title, channelName, avatar, views, id }) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-45 sm:w-48 flex-shrink-0 cursor-pointer relative"
      onClick={() => navigate(`/play-short/${id}`)}
    >
      <div className="rounded-xl overflow-hidden bg-black w-full h-70 border-1 border-gray-700">
        <video
          src={shortUrl}
          className="w-full h-full object-cover"
          muted
          playsInline
          onContextMenu={(e) => e.preventDefault()}
          preload="metadata"
        />
      </div>
      <div className="mt-2 space-y-2 w-full absolute bottom-0 p-3 bg-[#00000031] rounded-xl">
        <h3 className="text-sm font-semibold text-white line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <img
            src={avatar}
            alt=""
            className="w-6 h-6 object-cover rounded-full"
          />
          <span className="text-xs text-gray-400">{channelName}</span>
        </div>
        <span className="text-xs text-gray-400">
          {Number(views) >= 1_000_000
            ? `${Number(views) / 1_000_000}M views`
            : Number(views) >= 1_000
            ? `${Number(views) / 1_000}K views`
            : views}{" "}
          views
        </span>
      </div>
    </div>
  );
};

export default ShortCard;
