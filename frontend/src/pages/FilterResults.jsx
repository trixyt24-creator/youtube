import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import ShortCard from "../components/ShortCard";
import { getVideoDuration } from "../components/getVideoDuration";

const FilterResults = ({ filterResults }) => {
  const isEmpty =
    (!filterResults?.videos || filterResults.videos.length === 0) &&
    (!filterResults?.shorts || filterResults.shorts.length === 0) &&
    (!filterResults?.playlists || filterResults.playlists.length === 0) &&
    (!filterResults?.channels || filterResults.channels.length === 0);

  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (
      Array.isArray(filterResults?.videos) &&
      filterResults?.videos?.length > 0
    ) {
      filterResults?.videos?.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
        });
      });
    }
  }, [filterResults?.videos]);

  console.log(filterResults.keywords[0]);
  if (filterResults.keywords[0] === "All") return <div></div>;
  return (
    <div className="px-6 py-4 border-1 border-gray-800 my-[20px]">
      <h2 className="text-2xl font-semibold mb-4">Search Results: </h2>
      {isEmpty ? (
        <p className="text-gray-400 text-lg">No results found!</p>
      ) : (
        <>
          {filterResults?.videos?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterResults?.videos?.map((video) => (
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
          {filterResults?.shorts?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Shorts</h3>
              <div className="flex pb-4 gap-4 scrollbar-hide overflow-x-auto">
                {filterResults?.shorts?.map((short) => (
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
        </>
      )}
    </div>
  );
};

export default FilterResults;
