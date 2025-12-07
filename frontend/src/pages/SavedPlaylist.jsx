import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../App";
import { FaList } from "react-icons/fa";
import PlaylistCard from "../components/PlaylistCard";
import { ClipLoader } from "react-spinners";

const SavedPlaylist = () => {
  const [savedPlaylists, setSavedPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSavedPlaylists = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/content/getAllSavedPlaylists`,
          {
            withCredentials: true,
          }
        );
        setSavedPlaylists(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getSavedPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-white">
        <ClipLoader color="#fff" size={40} />
      </div>
    );
  }

  if (savedPlaylists.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-white">
        <h2 className="text-2xl text-gray-400 font-semibold">
          No saved playlists found
        </h2>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-4 min-h-screen text-white bg-[#0f0f0f]">
      <h2 className="text-2xl font-semibold mb-6 border-b border-neutral-700 pb-3 flex items-center gap-3">
        <FaList className="size-6 text-red-500" />
        Saved Playlists
      </h2>
      <div className="flex flex-col items-center gap-6 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  sm:items-start sm:gap-4">
        {savedPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist?._id}
            id={playlist?._id}
            title={playlist?.title}
            videos={playlist?.videos}
            savedBy={playlist?.savedBy}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedPlaylist;
