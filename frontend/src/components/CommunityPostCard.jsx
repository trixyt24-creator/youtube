import { useState } from "react";
import {
  FaThumbsUp,
  FaRegThumbsUp,
  FaRegCommentAlt,
  FaArrowDown,
} from "react-icons/fa";
import moment from "moment";
import axios from "axios";
import { serverURL } from "../App";
import { useUserStore } from "../store/useUserStore";

const ReplyInput = ({ postId, commentId, onReplyPosted }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      const response = await axios.post(
        `${serverURL}/api/content/post/addReplyInTheComment`,
        { postId, commentId, message: replyText },
        { withCredentials: true }
      );
      onReplyPosted(response.data);
      setReplyText("");
      setShowReplyInput(false);
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  return (
    <div className="mt-2 ml-12">
      {showReplyInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-grow w-full border-b border-gray-700 bg-transparent py-1 text-sm focus:outline-none focus:border-red-600"
            autoFocus
          />
          <button
            onClick={() => setShowReplyInput(false)}
            className="text-xs font-semibold cursor-pointer text-gray-400 hover:text-white px-3 py-2 rounded-full flex-shrink-0"
          >
            Cancel
          </button>
          <button
            onClick={handleReplySubmit}
            className="bg-red-600 text-white cursor-pointer px-3 py-1 text-xs font-semibold rounded-full hover:bg-red-700 transition flex-shrink-0"
          >
            Reply
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowReplyInput(true)}
          className="text-xs font-semibold cursor-pointer text-gray-400 hover:text-white"
        >
          Reply
        </button>
      )}
    </div>
  );
};

const CommunityPostCard = ({ post, onUpdatePost }) => {
  const { loggedInUserData } = useUserStore();
  const {
    _id: postId,
    channel,
    content,
    image,
    createdAt,
    likes = [],
    comments = [],
  } = post;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [currentLikes, setCurrentLikes] = useState(likes);
  const isLiked = loggedInUserData
    ? currentLikes.includes(loggedInUserData._id)
    : false;
  const hasLongContent = content.length > 250;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!loggedInUserData) return;
    const originalLikes = currentLikes;
    setCurrentLikes(
      isLiked
        ? originalLikes.filter((id) => id !== loggedInUserData._id)
        : [...originalLikes, loggedInUserData._id]
    );
    try {
      const response = await axios.put(
        `${serverURL}/api/content/post/toggleLikes`,
        { postId },
        { withCredentials: true }
      );
      onUpdatePost(response.data);
    } catch (error) {
      setCurrentLikes(originalLikes);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(
        `${serverURL}/api/content/post/addCommentsInThePost`,
        { postId, message: newComment },
        { withCredentials: true }
      );
      onUpdatePost(response.data);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4 w-full text-white relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={channel?.avatar}
            alt={channel?.name}
            className="size-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">{channel?.name}</p>
            <p className="text-xs text-gray-400">
              {moment(createdAt).fromNow()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {hasLongContent && !isExpanded
            ? `${content.substring(0, 250)}...`
            : content}
        </p>
        {hasLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold text-gray-400 cursor-pointer hover:text-white mt-2"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
        {image && (
          <div className="mt-4 rounded-lg overflow-hidden border border-neutral-700 flex justify-center bg-black">
            <img
              src={image}
              alt="Post content"
              className="w-full md:w-auto md:max-h-[500px] h-auto object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-2 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className="p-2 rounded-full cursor-pointer hover:bg-neutral-800"
          >
            {isLiked ? (
              <FaThumbsUp size={18} className="text-white" />
            ) : (
              <FaRegThumbsUp size={18} className="text-gray-400" />
            )}
          </button>
          <span className="text-xs text-gray-400">
            {currentLikes.length > 0 ? currentLikes.length : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowComments(true)}
            className="p-2 rounded-full cursor-pointer hover:bg-neutral-800"
          >
            <FaRegCommentAlt size={16} className="text-gray-400" />
          </button>
          <span className="text-xs text-gray-400">
            {comments.length > 0 ? comments.length : ""}
          </span>
        </div>
      </div>

      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 h-[80%] bg-[#0f0f0f] text-white p-4 rounded-t-2xl flex flex-col z-10 border-t border-neutral-700">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3 className="font-semibold text-lg">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="p-2 rounded-full cursor-pointer hover:bg-neutral-800"
            >
              <FaArrowDown size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-hide space-y-4">
            {comments.length > 0 ? (
              comments
                .slice()
                .reverse()
                .map((comment) => (
                  <div key={comment._id}>
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.author?.photoUrl}
                        alt=""
                        className="size-8 rounded-full border border-gray-600"
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-400">
                          @{comment.author?.userName || "User"}
                        </p>
                        <p className="text-sm text-white">{comment.message}</p>
                      </div>
                    </div>
                    <div className="ml-12 mt-6 space-y-2">
                      {comment.replies
                        ?.slice()
                        .reverse()
                        .map((reply) => (
                          <div
                            key={reply._id}
                            className="flex items-start gap-3"
                          >
                            <img
                              src={reply.author?.photoUrl}
                              alt=""
                              className="size-6 rounded-full"
                            />
                            <div>
                              <p className="text-xs font-semibold text-gray-400">
                                @{reply.author?.userName || "User"}
                              </p>
                              <p className="text-sm text-white">
                                {reply.message}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <ReplyInput
                      postId={postId}
                      commentId={comment._id}
                      onReplyPosted={onUpdatePost}
                    />
                  </div>
                ))
            ) : (
              <p className="text-center text-sm text-gray-400 pt-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
          <div className="flex gap-2 pt-4 items-center flex-shrink-0 border-t border-neutral-800">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full border-b border-gray-700 bg-transparent py-1 text-sm focus:outline-none focus:border-red-600"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="bg-red-600 text-white cursor-pointer px-4 font-medium py-2 rounded-full hover:bg-red-700"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPostCard;
