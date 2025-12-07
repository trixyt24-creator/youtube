import { Link } from "react-router-dom";
import moment from "moment";

const VideoCard = ({
  id,
  thumbnail,
  duration,
  channelLogo,
  title,
  channelName,
  views,
  createdAt,
  isHorizontal = false,
}) => {
  const timeAgo = createdAt ? moment(createdAt).fromNow() : null;

  if (isHorizontal) {
    return (
      <Link
        to={`/play-video/${id}`}
        className="flex items-start w-full gap-3 p-2 hover:bg-neutral-800 rounded-lg transition duration-200"
      >
        <div className="relative flex-shrink-0 w-40 h-24 overflow-hidden rounded-lg">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          {duration && (
            <span className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
              {duration}
            </span>
          )}
        </div>

        <div className="flex-grow">
          <h3 className="text-white text-sm font-medium line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-400 text-xs mt-1">{channelName}</p>
          <p className="text-gray-400 text-xs">
            {Number(views) >= 1_000_000
              ? `${Number(views) / 1_000_000}M views`
              : Number(views) >= 1_000
              ? `${Number(views) / 1_000}K views`
              : views}{" "}
            views {timeAgo && `• ${timeAgo}`}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/play-video/${id}`} className="w-full cursor-pointer group">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        {duration && (
          <span className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
            {duration}
          </span>
        )}
      </div>
      <div className="flex items-start gap-3 mt-3">
        <img
          src={channelLogo}
          alt={channelName}
          className="w-9 h-9 mr-0 rounded-full object-cover"
        />
        <div>
          <h3 className="text-white font-medium text-base line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mt-1">{channelName}</p>
          <p className="text-gray-400 text-xs">
            {Number(views) >= 1_000_000
              ? `${Number(views) / 1_000_000}M views`
              : Number(views) >= 1_000
              ? `${Number(views) / 1_000}K views`
              : views}{" "}
            views {timeAgo && `• ${timeAgo}`}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
