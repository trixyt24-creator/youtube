import { useState } from "react";
import { FaPen, FaPlay, FaVideo } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import createVideosIcon from "../../assets/createVideosIcon.png";
import { useNavigate } from "react-router-dom";

const CreateContent = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const options = [
    { id: "Video", icon: <FaVideo size={24} />, title: "Upload Video" },
    { id: "Short", icon: <FaPlay size={24} />, title: "Create Shorts" },
    {
      id: "CommunityPost",
      icon: <FaPen size={24} />,
      title: "Write Community Post",
    },
    { id: "Playlist", icon: <FaList size={24} />, title: "Create Playlist" },
  ];

  const handleContentUpload = () => {
    if (selected === "Video") {
      navigate("/create-video");
    }
    if (selected === "Short") {
      navigate("/create-short");
    }
    if (selected === "CommunityPost") {
      navigate("/create-post");
    }
    if (selected === "Playlist") {
      navigate("/create-playlist");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-6 flex flex-col">
      <header className="mb-12 border-b border-[#3f3f3f] pb-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Create Content
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Choose What Type of Content You Want To Create for Your Audience
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {options.map((option) => (
          <div
            onClick={() => setSelected(option.id)}
            key={option.id}
            className={`bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg flex p-6 flex-col items-center text-center justify-center cursor-pointer transition ${
              selected === option.id
                ? "ring-2 ring-[#ff0000]"
                : "hover:bg-[#272727]"
            }`}
          >
            <div className="bg-[#272727] p-4 rounded-full mb-4">
              {option.icon}
            </div>
            <h2 className="text-lg font-semibold">{option.title}</h2>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center mt-10">
        <img src={createVideosIcon} alt="" className="w-40" />
        {!selected ? (
          <div className="flex flex-col items-center">
            <p className="text-center font-medium">
              Select an option to create content
            </p>
            <p className="text-gray-400 text-center text-sm">
              You have not selected any option yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-center font-medium">
              You have selected {selected}
            </p>
            <p className="text-gray-400 text-center text-sm">
              You can create {selected} here
            </p>
            <button
              onClick={handleContentUpload}
              className="bg-[#ff0000] text-white px-4 py-2 rounded-full cursor-pointer font-medium mt-6 hover:bg-[#ff0000]/90 transition duration-300"
            >
              + Create
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateContent;
