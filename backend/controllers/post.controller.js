import channelModel from "../models/channel.model.js";
import postModel from "../models/post.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

const populatePost = (query) => {
  return query
    .populate("channel", "name avatar")
    .populate("comments.author", "userName photoUrl")
    .populate("comments.replies.author", "userName photoUrl");
};

export const createPost = async (req, res) => {
  try {
    const { content, channelId } = req.body;
    if (!content || !channelId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const channel = await channelModel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    let imageUrl;
    if (req.file) {
      const imagePath = req.file.path;
      const uploadImage = await uploadOnCloudinary(imagePath);
      imageUrl = uploadImage.secure_url;
    }

    const post = await postModel.create({
      content,
      channel: channelId,
      image: imageUrl,
    });
    await channelModel.findByIdAndUpdate(channelId, {
      $push: { communityPosts: post._id },
    });
    const populatedPost = await populatePost(postModel.findById(post._id));
    return res
      .status(200)
      .json({ message: "Post created successfully", post: populatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await populatePost(postModel.find()).sort({ createdAt: -1 });
    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleLikesOfPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    const populatedPost = await populatePost(postModel.findById(post._id));
    return res.status(200).json(populatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCommentsInThePost = async (req, res) => {
  try {
    const { postId, message } = req.body;
    const userId = req.user._id;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({ author: userId, message });
    await post.save();
    const populatedPost = await populatePost(postModel.findById(postId));
    return res.status(200).json(populatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addReplyToPostComment = async (req, res) => {
  try {
    const { postId, commentId, message } = req.body;
    const userId = req.user._id;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const findOriginalComment = post.comments.id(commentId);
    if (!findOriginalComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    findOriginalComment.replies.push({ author: userId, message });
    await post.save();
    const populatedPost = await populatePost(postModel.findById(postId));
    return res.status(200).json(populatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId).populate("channel");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (content !== undefined) post.content = content;
    await post.save();
    const populatedPost = await populatePost(postModel.findById(postId));
    return res.status(200).json(populatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await postModel.findByIdAndDelete(postId);
    await channelModel.findByIdAndUpdate(post.channel, {
      $pull: { communityPosts: postId },
    });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
