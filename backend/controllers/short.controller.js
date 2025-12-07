import shortModel from "../models/short.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../models/channel.model.js";

export const createShort = async (req, res) => {
  try {
    const { title, description, channelId, tags } = req.body;

    if (!title || !req.file || !channelId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const channelExists = await Channel.findById(channelId);
    if (!channelExists) {
      return res.status(400).json({ message: "Channel does not exist" });
    }

    const shortPath = req.file.path;

    const uploadShort = await uploadOnCloudinary(shortPath);
    const shortUrl = uploadShort.secure_url;

    let parsedTagsInArray = [];
    if (tags) {
      parsedTagsInArray = JSON.parse(tags);
    }

    const createdShort = await shortModel.create({
      title,
      description,
      shortUrl,
      channel: channelId,
      tags: parsedTagsInArray,
    });

    await Channel.findByIdAndUpdate(
      channelId,
      {
        $push: { shorts: createdShort._id },
      },
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "Short created successfully", short: createdShort });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllShorts = async (req, res) => {
  try {
    const getShorts = await shortModel
      .find()
      .sort({ createdAt: -1 })
      .populate("channel")
      .populate({
        path: "comments.author",
        select: "userName photoUrl",
      })
      .populate({
        path: "comments.replies.author",
        select: "userName photoUrl",
      });
    if (!getShorts) {
      return res.status(404).json({ message: "No shorts found" });
    }
    return res.status(200).json(getShorts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleLikesOfShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.user._id;
    const short = await shortModel.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    const isLiked = short.likes.includes(userId);
    if (isLiked) {
      short.likes.pull(userId);
    } else {
      short.likes.push(userId);
      short.dislikes.pull(userId);
    }
    await short.save();
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleDislikesOfShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.user._id;
    const short = await shortModel.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    const isDisliked = short.dislikes.includes(userId);
    if (isDisliked) {
      short.dislikes.pull(userId);
    } else {
      short.dislikes.push(userId);
      short.likes.pull(userId);
    }
    await short.save();
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleSavedByOfShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.user._id;
    const short = await shortModel.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    const isSavedBy = short.savedBy.includes(userId);
    if (isSavedBy) {
      short.savedBy.pull(userId);
    } else {
      short.savedBy.push(userId);
    }
    await short.save();
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getViewsOfTheShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await shortModel.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    short.views += 1;
    await short.save();
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCommentsInTheShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.user._id;
    const { message } = req.body;
    const short = await shortModel.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    short.comments.push({ author: userId, message });
    await short.save();
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addReplyInTheCommentOfTheShort = async (req, res) => {
  try {
    const { shortId, commentId } = req.params;
    const userId = req.user._id;
    const { message } = req.body;
    const short = await shortModel.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    const findOriginalComment = short.comments.id(commentId);
    if (!findOriginalComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    findOriginalComment.replies.push({ author: userId, message });
    await short.save();
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserLikedShorts = async (req, res) => {
  try {
    const userId = req.user._id;
    const likedShorts = await shortModel
      .find({ likes: userId })
      .populate("channel", "name avatar")
      .populate("likes", "userName photoUrl email")
      .sort({ createdAt: -1 });

    if (!likedShorts) {
      return res.status(404).json({ message: "No liked shorts found" });
    }
    return res.status(200).json(likedShorts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserSavedShorts = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedShorts = await shortModel
      .find({ savedBy: userId })
      .populate("channel", "name avatar")
      .populate("likes", "userName photoUrl email")
      .sort({ createdAt: -1 });

    if (!savedShorts) {
      return res.status(404).json({ message: "No saved shorts found" });
    }
    return res.status(200).json(savedShorts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await shortModel
      .findById(shortId)
      .populate("channel", "name avatar")
      .populate("likes", "username photoUrl");
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { title, description, tags } = req.body;
    const short = await shortModel.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    if (title) short.title = title;
    if (description) short.description = description;
    if (tags) {
      try {
        const parsedTagsInArray = JSON.parse(tags);
        short.tags = parsedTagsInArray;
      } catch (error) {
        short.tags = [];
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await shortModel.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    await Channel.findByIdAndUpdate(short.channel, {
      $pull: {
        shorts: short._id,
      },
    });
    await shortModel.findByIdAndDelete(shortId);
    return res.status(200).json({ message: "Short deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
