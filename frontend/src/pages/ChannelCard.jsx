import { useNavigate } from "react-router-dom";

const ChannelCard = ({ id, name, avatar }) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 hover:bg-[#272727] cursor-pointer"
      onClick={() => navigate(`/channel-page/${id}`)}
    >
      <img src={avatar} alt="" className="size-14 rounded-full object-cover" />
      <h2 className="text-lg font-semibold text-gray-300">{name}</h2>
    </div>
  );
};

export default ChannelCard;
