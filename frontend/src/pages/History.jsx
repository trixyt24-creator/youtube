import { useEffect, useState } from "react";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import { GoVideo } from "react-icons/go";
import VideoCard from "../components/VideoCard";
import { useHistoryStore } from "../store/useHistoryStore";
import { ClipLoader } from "react-spinners";
import { getVideoDuration } from "../components/getVideoDuration";

const History = () => {
  const { videoHistory, shortHistory } = useHistoryStore();

  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (Array.isArray(videoHistory) && videoHistory.length > 0) {
      videoHistory.forEach((video) => {
        console.log(video);
        getVideoDuration(video.contentId?.videoUrl, (formattedTime) => {
          setDuration((prev) => ({
            ...prev,
            [video.contentId?._id]: formattedTime,
          }));
        });
      });
    }
    setLoading(false);
  }, [videoHistory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-white">
        <ClipLoader color="#fff" size={40} />
      </div>
    );
  }

  if (videoHistory.length === 0 && shortHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <h2 className="text-2xl text-gray-400 font-semibold">
          No history found
        </h2>
      </div>
    );
  }
  return (
    <div className="px-6 py-4 min-h-screen">
      {shortHistory.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="size-7 text-red-600" />
            Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {shortHistory.map((short) => {
              if (short?.contentId?.shortUrl) {
                return (
                  <div className="flex-shrink-0" key={short?.contentId._id}>
                    <ShortCard
                      shortUrl={short?.contentId?.shortUrl}
                      title={short?.contentId?.title}
                      channelName={short?.contentId?.channel?.name}
                      avatar={short?.contentId?.channel?.avatar}
                      views={short?.contentId?.views}
                      id={short?.contentId._id}
                    />
                  </div>
                );
              }
            })}
          </div>
        </>
      )}
      {videoHistory.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="size-7 text-red-600" />
            Videos
          </h2>
          <div className="flex flex-wrap overflow-x-auto gap-4 scrollbar-hide">
            {videoHistory.map((video) => {
              if (video?.contentId?.videoUrl) {
                return (
                  <div
                    className="sm:size-60 size-87 flex-shrink-0"
                    key={video?.contentId?._id}
                  >
                    <VideoCard
                      videoUrl={video?.contentId?.videoUrl}
                      title={video?.contentId?.title}
                      channelName={video?.contentId?.channel?.name}
                      channelLogo={video?.contentId?.channel?.avatar}
                      thumbnail={video?.contentId?.thumbnail}
                      views={video?.contentId?.views}
                      id={video?.contentId?._id}
                      duration={duration[video?.contentId?._id] || "0:00"}
                    />
                  </div>
                );
              }
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default History;
