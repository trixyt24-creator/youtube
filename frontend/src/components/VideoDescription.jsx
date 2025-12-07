import { useState } from "react";

const VideoDescription = ({ text }) => {
  const [expand, setExpand] = useState(false);
  const showMore = text?.length > 100;
  return (
    <div
      className={`relative ${
        expand ? "h-48" : "h-12"
      } overflow-y-auto p-1 scrollbar-hide`}
    >
      <p
        className={`text-sm text-gray-300 whitespace-pre-line ${
          expand ? "" : "line-clamp-1"
        }`}
      >
        {text}
      </p>
      {showMore && (
        <button
          onClick={() => setExpand(!expand)}
          className="text-sm cursor-pointer text-blue-500 hover:underline whitespace-pre-line"
        >
          {expand ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default VideoDescription;
