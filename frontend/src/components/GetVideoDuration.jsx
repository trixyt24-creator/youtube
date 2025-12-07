const GetVideoDuration = (videoUrl, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = videoUrl;
  video.onloadedmetadata = () => {
    const duration = video.duration;
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    callback(formattedTime);
  };
  video.onerror = () => {
    callback("0:00");
  };
};

export default GetVideoDuration;