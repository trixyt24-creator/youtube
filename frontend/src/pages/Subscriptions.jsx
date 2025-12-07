import { useEffect, useState } from "react";
import { useSubscribedContentStore } from "../store/useSubscribedContentStore";
import { useNavigate } from "react-router-dom";
import PlaylistCard from "../components/PlaylistCard";
import VideoCard from "../components/VideoCard";
import ShortCard from "../components/ShortCard";
import { SiYoutubeshorts } from "react-icons/si";
import { GoVideo } from "react-icons/go";
import { FaList } from "react-icons/fa";
import CommunityPostCard from "../components/CommunityPostCard";
import { ClipLoader } from "react-spinners";
import  getVideoDuration  from "../components/GetVideoDuration";

const Subscriptions = () => {
  const {
    setSusbscribedChannels,
    subscribedChannels,
    subscribedChannelVideos,
    subscribedChannelShorts,
    subscribedChannelPlaylists,
    subscribedChannelCommunityPosts,
  } = useSubscribedContentStore();
  const [duration, setDuration] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      Array.isArray(subscribedChannelVideos) &&
      subscribedChannelVideos.length > 0
    ) {
      subscribedChannelVideos.forEach((video) => {
        if (video?.videoUrl) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
          });
        }
      });
    }
    setLoading(false);
  }, [subscribedChannelVideos]);

  const handlePostUpdate = (updatedPost) => {
    setSusbscribedChannels((prevChannel) => {
      const updatedPosts = prevChannel.communityPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      return { ...prevChannel, communityPosts: updatedPosts };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-white">
        <ClipLoader color="#fff" size={40} />
      </div>
    );
  }

  if (subscribedChannels?.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <h2 className="text-2xl text-gray-400 font-semibold">
          No Subscribed channels found
        </h2>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 min-h-screen">
      {/* Subscribed channels */}
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {subscribedChannels?.map((channel) => (
          <div
            key={channel._id}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer  transition-transform duration-200 ml-2 mt-4"
            onClick={() => navigate(`/channel-page/${channel._id}`)}
          >
            <img
              src={channel?.avatar}
              alt=""
              className="hover:ring-3 hover:ring-red-600 w-18 h-18 object-cover rounded-full"
            />
            <p className="text-sm truncate font-semibold mt-2">
              {channel?.name}
            </p>
          </div>
        ))}
      </div>

      {/* Subscribed videos */}
      <div className="px-6 py-4 min-h-screen">
        {subscribedChannelShorts?.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
              <SiYoutubeshorts className="size-7 text-red-600" />
              Shorts
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {subscribedChannelShorts?.map((short) => (
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
        {subscribedChannelVideos?.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
              <GoVideo className="size-7 text-red-600" />
              Videos
            </h2>
            <div className="flex flex-col items-center gap-6 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  sm:items-start sm:gap-4">
              {subscribedChannelVideos?.map((video) => (
                <div
                  className="sm:size-60 size-87 flex-shrink-0"
                  key={video._id}
                >
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

        <>
          <h2 className="text-2xl font-semibold mb-6 border-b pt-[25px] border-gray-300 pb-3 flex items-center gap-3">
            <FaList className="size-6 text-red-500" />
            Playlists
          </h2>
          <div className="flex flex-col items-center gap-6 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  sm:items-start sm:gap-4">
            {subscribedChannelPlaylists?.length > 0 &&
              subscribedChannelPlaylists?.map((playlist) => (
                <PlaylistCard
                  key={playlist?._id}
                  id={playlist?._id}
                  title={playlist?.title}
                  videos={playlist?.videos}
                  savedBy={playlist?.savedBy}
                />
              ))}
          </div>
        </>
        <>
          <h2 className="text-2xl font-semibold mb-6 border-b pt-[50px] border-gray-300 pb-3 flex items-center gap-3">
            <FaList className="size-6 text-red-500" />
            Community Posts
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {subscribedChannelCommunityPosts?.length > 0 &&
              subscribedChannelCommunityPosts?.map((post) => (
                <CommunityPostCard
                  key={post._id}
                  post={post}
                  onUpdatePost={handlePostUpdate}
                />
              ))}
          </div>
        </>
      </div>
    </div>
  );
};

export default Subscriptions;
