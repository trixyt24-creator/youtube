import { useEffect, useState } from "react";
import { useRecommendedStore } from "../store/useRecommendedStore";
import VideoCard from "../components/VideoCard";
import ShortCard from "../components/ShortCard";
import { SiYoutubeshorts } from "react-icons/si";
import { getVideoDuration } from "../components/getVideoDuration";

const RecommendedContent = () => {
  const { recommendedContent } = useRecommendedStore();

  const allVideos = [
    ...(recommendedContent?.recommendedVideos || []),
    ...(recommendedContent?.remainingVideos || []),
  ];
  const allShorts = [
    ...(recommendedContent?.recommendedShorts || []),
    ...(recommendedContent?.remainingShorts || []),
  ];

  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (Array.isArray(allVideos) && allVideos?.length > 0) {
      allVideos?.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
        });
      });
    }
  }, [allVideos]);

  if (allVideos?.length === 0 && allShorts.length === 0) {
    return null;
  }
  return (
    <div className="px-6 py-4 mb-[20px]">
      {allVideos?.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allVideos?.map((video) => (
              <VideoCard
                key={video?._id}
                id={video?._id}
                thumbnail={video?.thumbnail}
                title={video?.title}
                channelName={video?.channel?.name}
                views={video?.views}
                duration={duration[video?._id] || "0:00"}
                channelLogo={video?.channel?.avatar}
              />
            ))}
          </div>
        </div>
      )}
      {allShorts?.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-1">
            <SiYoutubeshorts className="text-red-600 size-6" />
            Shorts
          </h2>
          <div className="flex pb-4 gap-4 scrollbar-hide overflow-x-auto">
            {allShorts?.map((short) => (
              <div className="flex-shrink-0" key={short?._id}>
                <ShortCard
                  id={short?._id}
                  shortUrl={short?.shortUrl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  avatar={short?.channel?.avatar}
                  views={short?.views}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedContent;
