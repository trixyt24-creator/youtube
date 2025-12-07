import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import videoModel from "../models/video.model.js";
import shortModel from "../models/short.model.js";

export const getCurrentLoggedInUser = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingChannel = await Channel.findOne({ owner: userId });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel already exists" });
    }
    let banner;
    let avatar;
    if (req.files?.avatar) {
      const result = await uploadOnCloudinary(req.files.avatar[0].path);
      avatar = result.secure_url;
    }
    if (req.files?.banner) {
      const result = await uploadOnCloudinary(req.files.banner[0].path);
      banner = result.secure_url;
    }
    const channel = await Channel.create({
      name,
      avatar,
      banner,
      description,
      category,
      owner: userId,
    });
    await User.findByIdAndUpdate(userId, {
      channel: channel._id,
      userName: name,
      photoUrl: avatar,
    });
    return res.status(200).json(channel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const customizeChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isChannelExists = await Channel.findOne({ owner: userId });
    if (!isChannelExists) {
      return res.status(400).json({ message: "Channel not found" });
    }
    let banner;
    let avatar;
    if (req.files?.avatar) {
      const result = await uploadOnCloudinary(req.files.avatar[0].path);
      avatar = result.secure_url;
    }
    if (req.files?.banner) {
      const result = await uploadOnCloudinary(req.files.banner[0].path);
      banner = result.secure_url;
    }

    const channel = await Channel.findOneAndUpdate(
      { owner: userId },
      {
        name: name || isChannelExists.name,
        avatar: avatar || isChannelExists.avatar,
        banner: banner || isChannelExists.banner,
        description: description || isChannelExists.description,
        category: category || isChannelExists.category,
        owner: userId,
      },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      userName: name || isChannelExists.name,
      photoUrl: avatar || isChannelExists.avatar,
    });

    return res.status(200).json(channel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserChannel = async (req, res) => {
  try {
    const userId = req.user._id;
    const channel = await Channel.findOne({ owner: userId })
      .populate("owner")
      .populate("shorts")
      .populate("videos")
      .populate("playlists")
      .populate("subscribers")
      .populate({
        path: "communityPosts",
        populate: {
          path: "channel",
          model: "Channel",
        },
      })
      .populate({
        path: "playlists",
        populate: {
          path: "videos",
          model: "Video",
          populate: {
            path: "channel",
            model: "Channel",
          },
        },
      });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    return res.status(200).json(channel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleSubscribers = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.user._id;
    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required" });
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const isSubscribed = channel.subscribers.includes(userId);
    if (isSubscribed) {
      channel?.subscribers.pull(userId);
    } else {
      channel?.subscribers.push(userId);
    }
    await channel.save();
    const updatedChannel = await Channel.findById(channelId)
      .populate("owner")
      .populate("shorts")
      .populate("videos");
    return res.status(200).json(updatedChannel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate("owner")
      .populate("shorts")
      .populate("videos")
      .populate("subscribers")
      .populate({
        path: "communityPosts",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "channel", select: "name avatar" },
          { path: "comments.author", select: "userName photoUrl" },
          { path: "comments.replies.author", select: "userName photoUrl" },
        ],
      })
      .populate({
        path: "playlists",
        populate: {
          path: "videos",
          model: "Video",
          populate: {
            path: "channel",
            model: "Channel",
          },
        },
      });
    if (!channels || channels.length === 0) {
      return res.status(404).json({ message: "Channels not found" });
    }
    return res.status(200).json(channels);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSubscribedContentData = async (req, res) => {
  try {
    const userId = req.user._id;
    const subscribers = await Channel.find({ subscribers: userId })
      .populate({
        path: "videos",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      })
      .populate({
        path: "shorts",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      })
      .populate({
        path: "playlists",
        populate: {
          path: "channel",
          select: "name avatar",
        },
        populate: {
          path: "videos",
          populate: {
            path: "channel",
          },
        },
      })
      .populate({
        path: "communityPosts",
        populate: [
          { path: "channel", select: "name avatar" },
          { path: "comments.author", select: "userName photoUrl" },
          { path: "comments.replies.author", select: "userName photoUrl" },
        ],
      });

    if (!subscribers || subscribers.length === 0) {
      return res.status(404).json({ message: "No subscribed channels found" });
    }

    const videos = subscribers.flatMap((channel) => channel.videos);
    const shorts = subscribers.flatMap((channel) => channel.shorts);
    const playlists = subscribers.flatMap((channel) => channel.playlists);
    const communityPosts = subscribers.flatMap(
      (channel) => channel.communityPosts
    );

    return res
      .status(200)
      .json({ subscribers, videos, shorts, playlists, communityPosts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { contentId, contentType } = req.body;

    if (!["Video", "Short"].includes(contentType)) {
      return res.status(400).json({ message: "Invalid content type" });
    }

    let content;
    if (contentType === "Video") {
      content = await videoModel.findById(contentId);
    } else if (contentType === "Short") {
      content = await shortModel.findById(contentId);
    } else {
      return res.status(404).json({ message: "Content not found" });
    }

    // pull if previously watched
    await User.findByIdAndUpdate(userId, {
      $pull: {
        history: {
          contentId,
          contentType,
        },
      },
    });

    // add again with fresh watchedAt
    await User.findByIdAndUpdate(userId, {
      $push: {
        history: {
          contentId,
          contentType,
          watchedAt: new Date(),
        },
      },
    });
    return res.status(200).json({ message: "History added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: "history.contentId",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      })
      .select("history");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sortHistory = [...user.history].sort(
      (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
    );
    return res.status(200).json(sortHistory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecommendedContent = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // get user with history
    const user = await User.findById(userId)
      .populate("history.contentId")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // collect keywords from history
    const historyKeywords = user.history.map(
      (item) => item.contentId?.title || ""
    );

    // collect liked & saved content
    const likedVideos = await videoModel.find({ likes: userId });
    const likedShorts = await shortModel.find({ likes: userId });
    const savedShorts = await shortModel.find({ savedBy: userId });
    const savedVideos = await videoModel.find({ savedBy: userId });

    const likedSavedKeywords = [
      ...likedVideos.map((item) => item.title),
      ...likedShorts.map((item) => item.title),
      ...savedShorts.map((item) => item.title),
      ...savedVideos.map((item) => item.title),
    ];

    // merge all keywords
    const allKeywords = [...historyKeywords, ...likedSavedKeywords]
      .filter(Boolean)
      .map((keyword) => keyword.split(" "))
      .flat();

    // build regex conditions
    const videoConditions = [];
    const shortConditions = [];

    allKeywords.forEach((keyword) => {
      videoConditions.push(
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } }
      );
      shortConditions.push(
        { title: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } }
      );
    });

    // recommended content
    const recommendedVideos = await videoModel
      .find({
        $or: videoConditions,
      })
      .populate("channel comments.author comments.replies.author");

    const recommendedShorts = await shortModel
      .find({
        $or: shortConditions,
      })
      .populate("channel", "name avatar")
      .populate("likes", "userName photoUrl");

    // remaining content

    const recommendedVideosIds = recommendedVideos.map((item) => item._id);
    const recommendedShortsIds = recommendedShorts.map((item) => item._id);

    const remainingVideos = await videoModel
      .find({
        _id: { $nin: recommendedVideosIds },
      })
      .sort({ createdAt: -1 })
      .populate("channel");

    const remainingShorts = await shortModel
      .find({
        _id: { $nin: recommendedShortsIds },
      })
      .sort({ createdAt: -1 })
      .populate("channel");

    return res.status(200).json({
      recommendedVideos,
      recommendedShorts,
      remainingVideos,
      remainingShorts,
      usedKeywords: allKeywords,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
