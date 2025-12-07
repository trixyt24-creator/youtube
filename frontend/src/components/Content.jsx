import { useState } from "react";
import { useChannelStore } from "../store/useChannelStore";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const navigate = useNavigate();
  const { channelData } = useChannelStore();
  const [activeTab, setActiveTab] = useState("Videos");
  return (
    <div className="text-white bg-[#0f0f0f] min-h-screen pt-5 px-4 sm:px-6 mb-16">
      <div className="flex flex-wrap gap-6 mb-6">
        {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
          <button
            key={tab}
            className={`pb-3 relative font-medium transition cursor-pointer ${
              activeTab === tab
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
      <div className="space-y-8">
        {/* videos */}
        {activeTab === "Videos" && (
          <div>
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full border rounded-lg border-gray-700 hidden md:table">
                <thead className="bg-gray-900 text-sm">
                  <tr>
                    <th className="p-3 text-left">Thumbnail</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Views</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.videos?.map((video, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-700 hover:bg-zinc-700/40"
                    >
                      <td className="p-3">
                        <img
                          src={video?.thumbnail}
                          alt=""
                          className="w-20 h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-3 text-sm">{video.title}</td>
                      <td className="p-3 text-sm">{video.views}</td>
                      <td className="p-3">
                        <FaEdit
                          className="cursor-pointer hover:text-red-500"
                          onClick={() =>
                            navigate(
                              `/yt-studio/content/update-video/${video._id}`
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-6 md:hidden">
              {channelData?.videos?.map((video) => (
                <div
                  key={video._id}
                  className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <img
                    src={video?.thumbnail}
                    className="w-full aspect-video object-cover"
                    alt={video.title}
                  />
                  <div className="flex-1 p-3">
                    <h3 className="text-base font-semibold text-white line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                  <div className="px-3 py-2 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span>{video.views} views</span>
                    <FaEdit
                      className="cursor-pointer hover:text-red-500"
                      onClick={() =>
                        navigate(`/yt-studio/content/update-video/${video._id}`)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* shorts */}
        {activeTab === "Shorts" && (
          <div>
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full border rounded-lg border-gray-700 hidden md:table">
                <thead className="bg-gray-900 text-sm">
                  <tr>
                    <th className="p-3 text-left">Thumbnail</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Views</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.shorts?.map((short, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-700 hover:bg-zinc-700/40"
                    >
                      <td className="p-3">
                        <video
                          src={short?.shortUrl}
                          playsInline
                          muted
                          className="w-16 h-24 bg-black rounded"
                        />
                      </td>
                      <td className="p-3 text-sm">{short.title}</td>
                      <td className="p-3 text-sm">{short.views}</td>
                      <td className="p-3">
                        <FaEdit
                          onClick={() =>
                            navigate(
                              `/yt-studio/content/update-short/${short._id}`
                            )
                          }
                          className="cursor-pointer hover:text-red-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-6 md:hidden">
              {channelData?.shorts?.map((short) => (
                <div
                  key={short._id}
                  className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <video
                    src={short?.shortUrl}
                    playsInline
                    muted
                    controls
                    className="w-full aspect-[9/16] object-cover"
                  />
                  <div className="flex-1 p-3">
                    <h3 className="text-base font-semibold text-white line-clamp-2">
                      {short.title}
                    </h3>
                  </div>
                  <div className="px-3 py-2 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span>{short.views} views</span>
                    <FaEdit
                      onClick={() =>
                        navigate(`/yt-studio/content/update-short/${short._id}`)
                      }
                      className="cursor-pointer hover:text-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* playlists */}
        {activeTab === "Playlists" && (
          <div>
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full border rounded-lg border-gray-700 hidden md:table">
                <thead className="bg-gray-900 text-sm">
                  <tr>
                    <th className="p-3 text-left">Playlist</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Total Videos</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.playlists?.map((playlist, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-700 hover:bg-zinc-700/40"
                    >
                      <td className="p-3">
                        <img
                          src={playlist?.videos[0]?.thumbnail}
                          alt=""
                          className="w-20 h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-3 text-sm">{playlist?.title}</td>
                      <td className="p-3 text-sm">
                        {playlist?.videos?.length}
                      </td>
                      <td className="p-3">
                        <FaEdit
                          onClick={() =>
                            navigate(
                              `/yt-studio/content/update-playlist/${playlist._id}`
                            )
                          }
                          className="cursor-pointer hover:text-red-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-6 md:hidden">
              {channelData?.playlists?.map((playlist) => (
                <div
                  key={playlist?._id}
                  className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <img
                    src={playlist?.videos[0]?.thumbnail}
                    className="w-full aspect-video object-cover"
                    alt={playlist?.title}
                  />
                  <div className="flex-1 p-3">
                    <h3 className="text-base font-semibold text-white line-clamp-2">
                      {playlist?.title}
                    </h3>
                  </div>
                  <div className="px-3 py-2 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span>{playlist?.videos?.length} videos</span>
                    <FaEdit
                      onClick={() =>
                        navigate(
                          `/yt-studio/content/update-playlist/${playlist._id}`
                        )
                      }
                      className="cursor-pointer hover:text-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* community posts */}
        {activeTab === "Community" && (
          <div>
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full border rounded-lg border-gray-700 hidden md:table">
                <thead className="bg-gray-900 text-sm">
                  <tr>
                    <th className="p-3 text-left">Post</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Created At</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.communityPosts?.map((post, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-700 hover:bg-zinc-700/40"
                    >
                      <td className="p-3">
                        <img
                          src={post?.image}
                          alt=""
                          className="w-20 h-24 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-3 text-sm">{post?.content}</td>
                      <td className="p-3 text-sm">
                        {new Date(post?.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <FaEdit
                          onClick={() =>
                            navigate(
                              `/yt-studio/content/update-post/${post._id}`
                            )
                          }
                          className="cursor-pointer hover:text-red-500"
                          size={20}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-6 md:hidden">
              {channelData?.communityPosts?.map((post) => (
                <div
                  key={post._id}
                  className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <img
                    src={post?.image}
                    className="w-full object-cover"
                    alt={post?.content}
                  />
                  <div className="flex-1 p-3">
                    <h3 className="text-base font-semibold text-white line-clamp-2">
                      {post?.content}
                    </h3>
                  </div>
                  <div className="px-3 py-2 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(post?.createdAt).toLocaleString()}</span>
                    <FaEdit
                      onClick={() =>
                        navigate(`/yt-studio/content/update-post/${post._id}`)
                      }
                      className="cursor-pointer hover:text-red-500"
                      size={20}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
