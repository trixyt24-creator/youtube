import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../App";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import { GoVideo } from "react-icons/go";
import VideoCard from "../components/VideoCard";
import { ClipLoader } from "react-spinners";
import { getVideoDuration } from "../components/getVideoDuration";

const SavedContent = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [savedShorts, setSavedShorts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (Array.isArray(savedVideos) && savedVideos.length > 0) {
      savedVideos.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
        });
      });
    }
  }, [savedVideos]);

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const videosResponse = await axios.get(
          `${serverURL}/api/content/getUserSavedVideos`,
          {
            withCredentials: true,
          }
        );
        console.log(videosResponse);

        setSavedVideos(videosResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSavedShorts = async () => {
      try {
        const shortsResponse = await axios.get(
          `${serverURL}/api/content/getUserSavedShorts`,
          {
            withCredentials: true,
          }
        );
        console.log(shortsResponse);

        setSavedShorts(shortsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSavedVideos();
    fetchSavedShorts();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-white">
        <ClipLoader color="#fff" size={40} />
      </div>
    );
  }

  if (savedVideos.length === 0 && savedShorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <h2 className="text-2xl text-gray-400 font-semibold">
          No saved content found
        </h2>
      </div>
    );
  }
  return (
    <div className="px-6 py-4 min-h-screen">
      {savedShorts.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="size-7 text-red-600" />
            Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {savedShorts.map((short) => (
              <div className="flex-shrink-0" key={short._id}>
                <ShortCard
                  shortUrl={short?.shortUrl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  avatar={short?.channel?.avatar}
                  views={short?.views}
                  id={short?._id}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {savedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="size-7 text-red-600" />
            Videos
          </h2>
          <div className="flex flex-wrap">
            {savedVideos.map((video) => (
              <div className="sm:size-60 size-87 flex-shrink-0" key={video._id}>
                <VideoCard
                  videoUrl={video?.videoUrl}
                  title={video?.title}
                  channelName={video?.channel?.name}
                  channelLogo={video?.channel?.avatar}
                  thumbnail={video?.thumbnail}
                  views={video?.views}
                  id={video?._id}
                  duration={duration[video?._id] || "0:00"}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedContent;
