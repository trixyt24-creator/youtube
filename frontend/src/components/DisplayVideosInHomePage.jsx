import { useEffect, useState } from "react";
import { useContentStore } from "../store/useContentStore";
import VideoCard from "./VideoCard";
import  getVideoDuration  from "./GetVideoDuration";
import { useLocation } from "react-router-dom";

const DisplayVideosInHomePage = () => {
  const { videos, getAllVideos } = useContentStore();
  const [duration, setDuration] = useState({});
  const location = useLocation();

  useEffect(() => {
    getAllVideos();
  }, [getAllVideos, location.key]);

  useEffect(() => {
    if (Array.isArray(videos) && videos.length > 0) {
      videos.forEach((video) => {
        if (!duration[video._id]) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
          });
        }
      });
    }
  }, [videos]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-8 p-4">
      {videos?.map((video) => (
        <VideoCard
          key={video?._id}
          thumbnail={video?.thumbnail}
          duration={duration[video?._id] || "0:00"}
          channelLogo={video?.channel?.avatar}
          title={video?.title}
          channelName={video?.channel?.name}
          views={video?.views}
          id={video?._id}
          createdAt={video?.createdAt}
        />
      ))}
    </div>
  );
};

export default DisplayVideosInHomePage;
