import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContentStore } from "../../store/useContentStore";
import { serverURL } from "../../App";
import {
  FaBackward,
  FaBookmark,
  FaDownload,
  FaExpand,
  FaForward,
  FaPause,
  FaPlay,
  FaThumbsDown,
  FaThumbsUp,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../../components/ShortCard";
import { useUserStore } from "../../store/useUserStore";
import VideoDescription from "../../components/VideoDescription";
import axios from "axios";
import { useSubscribedContentStore } from "../../store/useSubscribedContentStore";

const IconButtons = ({ icon: Icon, active, label, count, onClick }) => {
  return (
    <button
      className="flex flex-col items-center gap-1 min-w-[80px]"
      onClick={onClick}
    >
      <div
        className={`p-3 rounded-full transition duration-200 cursor-pointer ${
          active
            ? "bg-white hover:bg-gray-300"
            : "bg-[#272727] hover:bg-gray-700"
        }`}
      >
        <Icon size={16} className={`${active ? "text-black" : "text-white"}`} />
      </div>
      <span className="text-xs text-center text-gray-400">
        {label || (count !== undefined ? count : "")}
      </span>
    </button>
  );
};

const PlayVideo = () => {
  const navigate = useNavigate();
  const processedVideoIdRef = useRef(null);
  const videoRef = useRef(null);
  const { videos, shorts, getAllVideos, getAllShorts } = useContentStore();
  const { loggedInUserData } = useUserStore();
  const { subscribedChannels, getSubscribedContentData } =
    useSubscribedContentStore();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    getAllVideos();
    getAllShorts();
    getSubscribedContentData();
  }, [videoId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!videoId) return;

    setIsVideoPlaying(true);

    const fetchCurrentVideoData = async () => {
      try {
        const res = await axios.get(
          `${serverURL}/api/content/video/${videoId}`,
          {
            withCredentials: true,
          }
        );
        setVideo(res.data);
        setChannel(res.data.channel);
      } catch (error) {
        console.log("Direct fetch failed, falling back to store", error);
        if (videos && videos.length > 0) {
          const currentVideo = videos.find((v) => v._id === videoId);
          if (currentVideo) {
            setVideo(currentVideo);
            setChannel(currentVideo.channel);
          }
        }
      }
    };

    fetchCurrentVideoData();

    if (processedVideoIdRef.current === videoId) return;

    const addNewView = async () => {
      try {
        processedVideoIdRef.current = videoId;
        setVideo((prev) =>
          prev ? { ...prev, views: (prev.views || 0) + 1 } : null
        );
        await axios.put(
          `${serverURL}/api/content/video/${videoId}/getViewsOfTheVideo`,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.log(err);
        processedVideoIdRef.current = null;
        setVideo((prev) => (prev ? { ...prev, views: prev.views - 1 } : null));
      }
    };
    addNewView();
  }, [videoId, videos]);

  useEffect(() => {
    if (!channel || !loggedInUserData || !subscribedChannels) return;

    const isActuallySubscribed = subscribedChannels.some(
      (subbedChannel) => subbedChannel._id === channel._id
    );
    setIsSubscribed(isActuallySubscribed);
  }, [channel, loggedInUserData, subscribedChannels]);

  useEffect(() => {
    const addHistory = async () => {
      try {
        const res = await axios.post(
          `${serverURL}/api/user/add-history`,
          { contentId: videoId, contentType: "Video" },
          { withCredentials: true }
        );
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (videoId) addHistory();
  }, [videoId]);

  const suggestedVideos =
    videos?.filter((video) => video._id !== videoId).slice(0, 10) || [];
  const suggestedShorts = shorts?.slice(0, 10) || [];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleBackward = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  const handleForward = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
    setDuration(videoRef.current.duration);
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleVideoEnded = () => setIsVideoPlaying(false);

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleVolume = (e) => {
    if (!videoRef.current) return;
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === "0");
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullScreenRequest = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen().catch((err) => console.error(err));
    }
  };

  const handleDownload = () => {
    if (!video) return;
    const link = document.createElement("a");
    link.href = video?.videoUrl;
    link.download = `${video?.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubscribe = async () => {
    if (!channel) return;
    setLoading(true);
    try {
      await axios.post(
        `${serverURL}/api/user/toggle-subscribers`,
        { channelId: channel._id },
        { withCredentials: true }
      );
      await getSubscribedContentData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLikes = async () => {
    if (!video || !loggedInUserData) return;
    try {
      await axios.put(
        `${serverURL}/api/content/video/${videoId}/toggleLikes`,
        {},
        { withCredentials: true }
      );
      setVideo((prev) => {
        if (!prev) return null;
        const userId = loggedInUserData._id;
        const hasLiked = prev.likes.includes(userId);

        let newLikes = [...prev.likes];
        let newDislikes = [...prev.dislikes];

        if (hasLiked) {
          newLikes = newLikes.filter((id) => id !== userId);
        } else {
          newLikes.push(userId);
          newDislikes = newDislikes.filter((id) => id !== userId);
        }

        return { ...prev, likes: newLikes, dislikes: newDislikes };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDislikes = async () => {
    if (!video || !loggedInUserData) return;
    try {
      await axios.put(
        `${serverURL}/api/content/video/${videoId}/toggleDislikes`,
        {},
        { withCredentials: true }
      );
      setVideo((prev) => {
        if (!prev) return null;
        const userId = loggedInUserData._id;
        const hasDisliked = prev.dislikes.includes(userId);

        let newLikes = [...prev.likes];
        let newDislikes = [...prev.dislikes];

        if (hasDisliked) {
          newDislikes = newDislikes.filter((id) => id !== userId);
        } else {
          newDislikes.push(userId);
          newLikes = newLikes.filter((id) => id !== userId);
        }

        return { ...prev, likes: newLikes, dislikes: newDislikes };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSavedBy = async () => {
    if (!video) return;
    try {
      const res = await axios.put(
        `${serverURL}/api/content/video/${videoId}/toggleSavedBy`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      setVideo((prev) => ({
        ...prev,
        savedBy: prev.savedBy.includes(loggedInUserData._id)
          ? prev.savedBy.filter((id) => id !== loggedInUserData._id)
          : [...prev.savedBy, loggedInUserData._id],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    if (!video || !loggedInUserData || !newComment.trim()) return;
    try {
      const res = await axios.post(
        `${serverURL}/api/content/video/${videoId}/addCommentsInTheVideo`,
        { message: newComment },
        { withCredentials: true }
      );
      console.log(res.data);
      setVideo(res.data);
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const addReply = async (commentId, newReply) => {
    if (!video || !loggedInUserData || !newReply.trim()) return;
    try {
      const res = await axios.post(
        `${serverURL}/api/content/video/${videoId}/${commentId}/addReplyInTheComment`,
        { message: newReply },
        { withCredentials: true }
      );
      console.log(res.data);
      setVideo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      <div className="flex-1">
        {/* Video Player */}
        <div
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
        >
          <video
            ref={videoRef}
            src={video?.videoUrl}
            controls={false}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className="w-full h-full object-contain"
          />
          {showControls && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20">
              <button
                onClick={handleBackward}
                className="bg-black/70 p-3 rounded-full sm:p-4 hover:bg-red-600 cursor-pointer transition"
              >
                <FaBackward size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="bg-black/70 p-3 rounded-full sm:p-4 hover:bg-red-600 cursor-pointer transition"
              >
                {isVideoPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                onClick={handleForward}
                className="bg-black/70 p-3 rounded-full sm:p-4 hover:bg-red-600 cursor-pointer transition"
              >
                <FaForward size={24} />
              </button>
            </div>
          )}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 z-20 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <input
              type="range"
              className="w-full cursor-pointer h-[5px] accent-red-600"
              min={0}
              max={100}
              value={isNaN(progress) ? 0 : progress}
              onChange={handleSeek}
            />
            <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200">
              <div className="flex items-center gap-3">
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleMute} className="p-2">
                  {isMuted ? (
                    <FaVolumeMute size={18} />
                  ) : (
                    <FaVolumeUp size={18} />
                  )}
                </button>
                <input
                  type="range"
                  className="w-20 cursor-pointer h-[5px] accent-red-600"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolume}
                />
                <button onClick={handleFullScreenRequest} className="p-2">
                  <FaExpand size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <h1 className="mt-4 text-lg sm:text-xl font-semibold text-white">
          {video?.title}
        </h1>
        <p className="text-sm text-gray-400 my-2">{video?.views} views</p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mt-4">
          {/* Channel Info Section */}
          <div className="flex items-center gap-4">
            <img
              onClick={() => navigate(`/channel-page/${channel?._id}`)}
              src={channel?.avatar}
              className="size-12 rounded-full border-2 border-gray-600 cursor-pointer flex-shrink-0"
              alt="channel avatar"
            />
            <div>
              <h2
                className="text-sm font-semibold text-white cursor-pointer"
                onClick={() => navigate(`/channel-page/${channel?._id}`)}
              >
                {channel?.name}
              </h2>
              <p className="text-xs text-gray-400">
                {channel?.subscribers?.length} subscribers
              </p>
            </div>
            {loggedInUserData?.channel !== channel?._id && (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className={`px-4 py-2 rounded-full ml-auto text-sm font-semibold whitespace-nowrap transition duration-300 cursor-pointer ${
                  isSubscribed
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          {/* Video Info Section */}

          <div className="flex items-center gap-2 justify-around pr-4 overflow-x-auto scrollbar-hide">
            <IconButtons
              icon={FaThumbsUp}
              active={video?.likes?.includes(loggedInUserData?._id)}
              label=""
              count={video?.likes?.length}
              onClick={toggleLikes}
            />
            <IconButtons
              icon={FaThumbsDown}
              active={video?.dislikes?.includes(loggedInUserData?._id)}
              label=""
              count={video?.dislikes?.length}
              onClick={toggleDislikes}
            />
            <IconButtons
              icon={FaDownload}
              label="Download"
              onClick={handleDownload}
            />
            <IconButtons
              icon={FaBookmark}
              active={video?.savedBy?.includes(loggedInUserData?._id)}
              label="Watch Later"
              onClick={toggleSavedBy}
            />
          </div>
        </div>

        <div className="mt-4 bg-[#1a1a1a] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <VideoDescription text={video?.description} />
        </div>

        <div className="mt-4 bg-[#1a1a1a] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Comments</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-700 bg-[#0f0f0f] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <button
              onClick={() => addComment()}
              className="bg-red-600 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-red-700 transition"
            >
              Post
            </button>
          </div>
          <div className="space-y-3 mt-8 max-h-[300px] overflow-y-auto scrollbar-hide">
            {video?.comments
              .slice()
              .reverse()
              .map((comment) => (
                <div
                  key={comment?._id}
                  className="p-2 bg-[#1a1a1a]  rounded-lg shadow-sm text-sm"
                >
                  <div className="flex items-center justify-start gap-3">
                    <img
                      src={comment?.author?.photoUrl}
                      alt=""
                      className="w-8 h-8 object-cover rounded-full"
                    />
                    <h2 className="font-semibold">
                      {comment?.author?.userName}
                    </h2>
                  </div>
                  <p className="font-medium py-[2vh]">{comment?.message}</p>
                  <div className="space-y-2 ml-5">
                    {comment?.replies.map((reply) => (
                      <div
                        key={reply?._id}
                        className="flex items-center justify-start gap-3 bg-[#2a2a2a] p-2 pl-5 rounded-lg"
                      >
                        <img
                          src={reply?.author?.photoUrl}
                          alt=""
                          className="w-8 h-8 object-cover rounded-full"
                        />
                        <h2 className="font-semibold">
                          {reply?.author?.userName}:
                        </h2>
                        <p className="font-medium py-[2vh]">{reply?.message}</p>
                      </div>
                    ))}
                  </div>
                  <ReplyCard reply={comment} handleReply={addReply} />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Suggested Videos & Shorts */}
      <div className="w-full lg:w-[380px] p-4 border-t lg:border-t-0 lg:border-l border-gray-800">
        <h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
          <SiYoutubeshorts className="text-red-600 size-5" />
          Shorts
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
          {suggestedShorts.map((short) => (
            <div
              key={short?._id}
              onClick={() => navigate(`/play-short/${short?._id}`)}
              className="flex gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition"
            >
              <ShortCard
                {...short}
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
        <h3 className="font-semibold text-lg my-4">Up Next</h3>
        <div className="space-y-3">
          {suggestedVideos.map((sVideo) => (
            <div
              onClick={() => navigate(`/play-video/${sVideo?._id}`)}
              key={sVideo?._id}
              className="flex gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition"
            >
              <img
                src={sVideo?.thumbnail}
                alt={sVideo?.title}
                className="w-40 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">
                  {sVideo?.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 my-1">
                  <img
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/channel-page/${sVideo?.channel?._id}`);
                    }}
                    src={sVideo?.channel?.avatar}
                    alt=""
                    className="w-6 h-6 object-cover rounded-full cursor-pointer"
                  />
                  <span className="text-xs text-gray-400">
                    {sVideo?.channel?.name}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {sVideo?.views} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReplyCard = ({ reply, handleReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    await handleReply(reply._id, replyText);
    setReplyText("");
    setShowReplyInput(false);
  };
  return (
    <div className="mt-5">
      {showReplyInput && (
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Add a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="border border-gray-700 bg-[#0f0f0f] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-600"
          />

          <button
            onClick={handleReplySubmit}
            className="bg-red-600 text-white px-3 cursor-pointer py-1 rounded-lg hover:bg-red-700 transition"
          >
            Post
          </button>
        </div>
      )}
      <button
        onClick={() => setShowReplyInput(!showReplyInput)}
        className="bg-red-600 text-white px-3 cursor-pointer py-1 rounded-lg hover:bg-red-700 transition"
      >
        {showReplyInput ? "Cancel" : "Reply"}
      </button>
    </div>
  );
};

export default PlayVideo;
