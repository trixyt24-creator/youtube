import channelModel from "../models/channel.model.js";
import playlistModel from "../models/playlist.model.js";
import videoModel from "../models/video.model.js";

export const createPlaylist = async (req, res) => {
  try {
    const { title, description, channelId, videoIds } = req.body;

    if (!title || !channelId || !videoIds) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const channel = await channelModel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const getVideosById = await videoModel.find({
      _id: { $in: videoIds },
      channel: channelId,
    });

    const playlist = await playlistModel.create({
      title,
      description,
      channel: channelId,
      videos: getVideosById,
    });

    await channelModel.findByIdAndUpdate(channelId, {
      $push: { playlists: playlist._id },
    });

    return res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const toggleSavedByPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.user._id;
    const playlist = await playlistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const isSaved = playlist.savedBy.includes(userId);
    if (isSaved) {
      playlist.savedBy.pull(userId);
    } else {
      playlist.savedBy.push(userId);
    }
    await playlist.save();
    return res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllSavedPlaylists = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedPlaylists = await playlistModel
      .find({ savedBy: userId })
      .populate("videos")
      .populate({
        path: "videos",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      });
    if (!savedPlaylists) {
      return res.status(404).json({ message: "No saved playlists found" });
    }
    return res.status(200).json(savedPlaylists);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await playlistModel
      .findById(playlistId)
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    return res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { title, description, videoIds } = req.body;

    const playlist = await playlistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (title !== undefined) playlist.title = title;
    if (description !== undefined) playlist.description = description;
    if (videoIds !== undefined && Array.isArray(videoIds)) {
      playlist.videos = videoIds;
    }

    await playlist.save();

    const updatedPlaylist = await playlistModel
      .findById(playlistId)
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        model: "Video",
        populate: {
          path: "channel",
          model: "Channel",
          select: "name avatar",
        },
      });

    return res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.log("Error updating playlist:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "Invalid video ID format provided." });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error updating playlist" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await playlistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    await channelModel.findByIdAndUpdate(playlist.channel, {
      $pull: {
        playlists: playlist._id,
      },
    });
    await playlistModel.findByIdAndDelete(playlistId);
    return res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
