import { useEffect, useState } from "react";
import ChannelCard from "./ChannelCard";
import VideoCard from "../components/VideoCard";
import PlaylistCard from "../components/PlaylistCard";
import ShortCard from "../components/ShortCard";
import { getVideoDuration } from "../components/getVideoDuration";

const SearchResults = ({ searchResults }) => {
  const isEmpty =
    (!searchResults?.videos || searchResults.videos.length === 0) &&
    (!searchResults?.shorts || searchResults.shorts.length === 0) &&
    (!searchResults?.playlists || searchResults.playlists.length === 0) &&
    (!searchResults?.channels || searchResults.channels.length === 0);

  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (
      Array.isArray(searchResults?.videos) &&
      searchResults?.videos?.length > 0
    ) {
      searchResults?.videos?.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
        });
      });
    }
  }, [searchResults?.videos]);

  return (
    <div className="px-6 py-4 border-1 border-gray-800 my-[20px]">
      <h2 className="text-2xl font-semibold mb-4">Search Results: </h2>
      {isEmpty ? (
        <p className="text-gray-400 text-lg">No results found!</p>
      ) : (
        <>
          {searchResults?.channels?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults?.channels?.map((channel) => (
                  <ChannelCard
                    key={channel?._id}
                    id={channel?._id}
                    name={channel?.name}
                    avatar={channel?.avatar}
                  />
                ))}
              </div>
            </div>
          )}
          {searchResults?.videos?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults?.videos?.map((video) => (
                  <VideoCard
                    key={video?._id}
                    id={video?._id}
                    thumbnail={video?.thumbnail}
                    title={video?.title}
                    channelName={video?.channel?.name}
                    views={video?.views}
                    duration={duration[video?._id] || "0:00"}
                    channelLogo={video?.channel?.avatar}
                    time={new Date(video?.createdAt).toLocaleDateString()}
                  />
                ))}
              </div>
            </div>
          )}
          {searchResults?.shorts?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Shorts</h3>
              <div className="flex pb-4 gap-4 scrollbar-hide overflow-x-auto">
                {searchResults?.shorts?.map((short) => (
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
          {searchResults?.playlists?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Playlists</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults?.playlists?.map((playlist) => (
                  <PlaylistCard
                    key={playlist?._id}
                    id={playlist?._id}
                    title={playlist?.title}
                    description={playlist?.description}
                    savedBy={playlist?.savedBy}
                    videos={playlist?.videos}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
