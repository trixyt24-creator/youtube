import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createVideo,
  getAllVideos,
  toggleLikesOfVideo,
  toggleDislikesOfVideo,
  toggleSavedByOfVideo,
  getViewsOfTheVideo,
  addCommentsInTheVideo,
  addReplyInTheComment,
  getUserLikedVideos,
  getUserSavedVideos,
  fetchVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/video.controller.js";
import {
  addCommentsInTheShort,
  addReplyInTheCommentOfTheShort,
  createShort,
  deleteShort,
  fetchShort,
  getAllShorts,
  getUserLikedShorts,
  getUserSavedShorts,
  getViewsOfTheShort,
  toggleDislikesOfShort,
  toggleLikesOfShort,
  toggleSavedByOfShort,
  updateShort,
} from "../controllers/short.controller.js";
import uploads from "../middlewares/multer.js";
import {
  createPlaylist,
  deletePlaylist,
  fetchPlaylist,
  getAllSavedPlaylists,
  toggleSavedByPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import {
  addCommentsInThePost,
  createPost,
  getAllPosts,
  toggleLikesOfPost,
  addReplyToPostComment,
  updatePost,
  deletePost,
  getPostById,
} from "../controllers/post.controller.js";
import {
  filterCategoryWithAI,
  searchWithAI,
} from "../controllers/ai.controller.js";
import upload from "../middlewares/multer.js";

const contentRouter = express.Router();

contentRouter.post(
  "/create-video",
  protectedRoute,
  uploads.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);
contentRouter.get("/getAllVideos", protectedRoute, getAllVideos);
contentRouter.put(
  "/video/:videoId/getViewsOfTheVideo",
  protectedRoute,
  getViewsOfTheVideo
);
contentRouter.put(
  "/video/:videoId/toggleLikes",
  protectedRoute,
  toggleLikesOfVideo
);
contentRouter.put(
  "/video/:videoId/toggleDislikes",
  protectedRoute,
  toggleDislikesOfVideo
);
contentRouter.put(
  "/video/:videoId/toggleSavedBy",
  protectedRoute,
  toggleSavedByOfVideo
);
contentRouter.post(
  "/video/:videoId/addCommentsInTheVideo",
  protectedRoute,
  addCommentsInTheVideo
);
contentRouter.post(
  "/video/:videoId/:commentId/addReplyInTheComment",
  protectedRoute,
  addReplyInTheComment
);
contentRouter.get("/getUserLikedVideos", protectedRoute, getUserLikedVideos);
contentRouter.get("/getUserSavedVideos", protectedRoute, getUserSavedVideos);
contentRouter.get("/fetchVideo/:videoId", protectedRoute, fetchVideo);
contentRouter.put(
  "/updateVideo/:videoId",
  protectedRoute,
  upload.single("thumbnail"),
  updateVideo
);
contentRouter.delete("/deleteVideo/:videoId", protectedRoute, deleteVideo);
// videos

contentRouter.post(
  "/create-short",
  protectedRoute,
  uploads.single("short"),
  createShort
);
contentRouter.get("/getAllShorts", protectedRoute, getAllShorts);
contentRouter.put(
  "/short/:shortId/getViewsOfTheShort",
  protectedRoute,
  getViewsOfTheShort
);
contentRouter.put(
  "/short/:shortId/toggleLikes",
  protectedRoute,
  toggleLikesOfShort
);
contentRouter.put(
  "/short/:shortId/toggleDislikes",
  protectedRoute,
  toggleDislikesOfShort
);
contentRouter.put(
  "/short/:shortId/toggleSavedBy",
  protectedRoute,
  toggleSavedByOfShort
);
contentRouter.post(
  "/short/:shortId/addCommentsInTheShort",
  protectedRoute,
  addCommentsInTheShort
);
contentRouter.post(
  "/short/:shortId/:commentId/addReplyInTheComment",
  protectedRoute,
  addReplyInTheCommentOfTheShort
);
contentRouter.get("/getUserLikedShorts", protectedRoute, getUserLikedShorts);
contentRouter.get("/getUserSavedShorts", protectedRoute, getUserSavedShorts);
contentRouter.get("/fetchShort/:shortId", protectedRoute, fetchShort);
contentRouter.put("/updateShort/:shortId", protectedRoute, updateShort);
contentRouter.delete("/deleteShort/:shortId", protectedRoute, deleteShort);

// shorts

contentRouter.get(
  "/getAllSavedPlaylists",
  protectedRoute,
  getAllSavedPlaylists
);
contentRouter.post("/create-playlist", protectedRoute, createPlaylist);
contentRouter.put(
  "/playlist/toggleSavedBy",
  protectedRoute,
  toggleSavedByPlaylist
);
contentRouter.get("/fetchPlaylist/:playlistId", protectedRoute, fetchPlaylist);
contentRouter.put(
  "/updatePlaylist/:playlistId",
  protectedRoute,
  updatePlaylist
);
contentRouter.delete(
  "/deletePlaylist/:playlistId",
  protectedRoute,
  deletePlaylist
);
// playlists

contentRouter.post(
  "/create-post",
  protectedRoute,
  uploads.single("image"),
  createPost
);
contentRouter.get("/getAllPosts", protectedRoute, getAllPosts);
contentRouter.put("/post/toggleLikes", protectedRoute, toggleLikesOfPost);
contentRouter.post(
  "/post/addCommentsInThePost",
  protectedRoute,
  addCommentsInThePost
);
contentRouter.post(
  "/post/addReplyInTheComment",
  protectedRoute,
  addReplyToPostComment
);
contentRouter.get("/fetchPost/:postId", protectedRoute, getPostById);
contentRouter.put("/updatePost/:postId", protectedRoute, updatePost);
contentRouter.delete("/deletePost/:postId", protectedRoute, deletePost);
// posts

contentRouter.post("/search", protectedRoute, searchWithAI);
contentRouter.post("/filter-category", protectedRoute, filterCategoryWithAI);
// AI

export default contentRouter;
