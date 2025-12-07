import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import axios from "axios";
import { serverURL } from "../../App";
import ShortCard from "../../components/ShortCard";
import VideoCard from "../../components/VideoCard";
import { useContentStore } from "../../store/useContentStore";
import PlaylistCard from "../../components/PlaylistCard";
import CommunityPostCard from "../../components/CommunityPostCard";
import { useSubscribedContentStore } from "../../store/useSubscribedContentStore";
import { ClipLoader } from "react-spinners";
import getVideoDuration from "../../components/GetVideoDuration";

const ChannelPage = () => {
  const { channelId } = useParams();
  const { getSubscribedContentData, subscribedChannels } =
    useSubscribedContentStore();
  const { loggedInUserData } = useUserStore();

  const [channel, setChannel] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Videos");
  const { videos, getAllVideos } = useContentStore();
  const [duration, setDuration] = useState({});

  useEffect(() => {
    const fetchChannelData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverURL}/api/user/get-all-channels`, {
          withCredentials: true,
        });
        if (res.data && Array.isArray(res.data)) {
          const currentChannel = res.data.find((ch) => ch._id === channelId);
          setChannel(currentChannel || null);
        }
      } catch (error) {
        console.log("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (channelId) {
      window.scrollTo(0, 0);
      fetchChannelData();
    }
  }, [channelId]);

  useEffect(() => {
    getAllVideos();
    getSubscribedContentData();
  }, [getAllVideos, getSubscribedContentData]);

  useEffect(() => {
    if (!channel || !loggedInUserData || !subscribedChannels) return;
    const isActuallySubscribed = subscribedChannels.some(
      (subbedChannel) => subbedChannel._id === channel._id
    );
    setIsSubscribed(isActuallySubscribed);
  }, [channel, loggedInUserData, subscribedChannels]);

  useEffect(() => {
    if (Array.isArray(videos) && videos.length > 0) {
      videos.forEach((video) => {
        if (video?.videoUrl) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
          });
        }
      });
    }
  }, [videos]);

  const handleSubscribe = async () => {
    if (!channel) return;
    try {
      const response = await axios.post(
        `${serverURL}/api/user/toggle-subscribers`,
        { channelId: channel._id },
        { withCredentials: true }
      );
      setChannel((prev) => ({
        ...prev,
        subscribers: response.data?.subscribers || prev.subscribers,
      }));
      getSubscribedContentData();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setChannel((prevChannel) => {
      const updatedPosts = prevChannel.communityPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      return { ...prevChannel, communityPosts: updatedPosts };
    });
  };

  if (loading || !channel) {
    return (
      <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex justify-center items-center">
        <ClipLoader color="white" size={40} />
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedTab) {
      case "Videos":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cup">
            {channel.videos?.map((video) => (
              <VideoCard
                key={video._id}
                id={video._id}
                thumbnail={video.thumbnail}
                title={video.title}
                channelName={channel.name}
                channelLogo={channel.avatar}
                views={video.views}
                duration={duration[video?._id] || "..."}
              />
            ))}
          </div>
        );
      case "Shorts":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {channel.shorts?.map((short) => (
              <ShortCard
                key={short._id}
                id={short._id}
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={channel.name}
                avatar={channel.avatar}
                views={short.views}
              />
            ))}
          </div>
        );
      case "Playlists":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {channel.playlists?.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                id={playlist?._id}
                title={playlist?.title}
                videos={playlist?.videos}
                savedBy={playlist?.savedBy}
              />
            ))}
          </div>
        );
      case "Community Posts":
        return (
          <div className="max-w-2xl mx-auto space-y-4">
            {channel.communityPosts
              ?.slice()
              .reverse()
              .map((post) => (
                <CommunityPostCard
                  key={post._id}
                  post={post}
                  onUpdatePost={handlePostUpdate}
                />
              ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#0f0f0f] text-white min-h-screen">
      <div className="w-full h-32 md:h-48">
        {channel?.banner ? (
          <img
            src={channel?.banner}
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 rounded-lg"></div>
        )}
      </div>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={channel?.avatar}
            alt="Channel Avatar"
            className="size-24 sm:size-32 rounded-full border-4 border-[#0f0f0f] -mt-12 sm:-mt-16 flex-shrink-0"
          />
          <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
            <h1 className="text-2xl font-bold">{channel?.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-x-3 text-sm text-gray-400 mt-1 flex-wrap">
              <span>{channel?.subscribers?.length || 0} subscribers</span>
              <span>•</span>
              <span>{channel?.videos?.length || 0} videos</span>
              <span>•</span>
              <span>{channel?.category || "No Category"}</span>
            </div>
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex-shrink-0">
            {loggedInUserData?.channel !== channel?._id && (
              <button
                onClick={handleSubscribe}
                className={`w-full sm:w-auto font-semibold px-5 py-2 rounded-full transition ${
                  isSubscribed
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 border-b border-neutral-800">
          <div className="overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-2 sm:space-x-4 whitespace-nowrap -mb-px">
              {["Videos", "Shorts", "Playlists", "Community Posts"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`py-3 px-3 sm:px-4 text-sm cursor-pointer font-semibold transition ${
                      selectedTab === tab
                        ? "text-white border-b-2 border-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ChannelPage;
