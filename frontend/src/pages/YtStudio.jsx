import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useChannelStore } from "../store/useChannelStore";
import { SiYoutubestudio } from "react-icons/si";
import Profile from "../components/Profile";
import { FaChartBar, FaTachometerAlt, FaVideo } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoIosAddCircle } from "react-icons/io";

const YtStudio = () => {
  const navigate = useNavigate();
  const { channelData } = useChannelStore();
  const [open, setOpen] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-[60px] px-4 sm:px-6 flex items-center justify-between border-b border-neutral-800 bg-[#0f0f0f] shadow-md flex-shrink-0 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <SiYoutubestudio className="text-red-500 size-6" />
          <h1 className="text-lg sm:text-xl font-semibold tracking-wide text-white">
            Studio
          </h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/create-content")}
            className="bg-[#272727] rounded-full cursor-pointer hidden px-4 py-1 md:flex gap-1 hover:bg-zinc-700 transition duration-300 ease-in-out items-center"
          >
            <span className="text-xl">+</span>
            <span className="text-sm">Create</span>
          </button>
          <img
            onClick={() => setOpen(!open)}
            src={channelData?.avatar}
            alt="Channel Avatar"
            className="size-8 rounded-full border border-neutral-700 object-cover hover:opacity-80 transition cursor-pointer"
          />
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {" "}
        <aside
          className={`bg-[#0f0f0f] border-r border-neutral-800 transition-all duration-300 fixed top-[60px] bottom-0 left-0 z-40 ${
            sideBarOpen ? "w-60" : "w-20"
          } hidden md:flex flex-col pt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent`}
        >
          <div
            className={`flex flex-col items-center gap-2 mb-6 text-center px-2 ${
              sideBarOpen ? "" : "py-2"
            }`}
          >
            <img
              src={channelData?.avatar}
              alt="Channel Avatar"
              className={`border border-neutral-700 object-cover rounded-full shadow-md transition-all duration-300 ${
                sideBarOpen ? "size-24" : "size-10"
              }`}
            />
            {sideBarOpen && (
              <>
                <h2 className="text-base font-semibold mt-2">
                  {channelData?.name}
                </h2>
                <p className="text-xs text-gray-400">Your Channel</p>
              </>
            )}
          </div>
          <nav className="space-y-1 p-2">
            <SideBarItem
              icon={<FaTachometerAlt />}
              text="Dashboard"
              open={sideBarOpen}
              selected={selectedItem === "Dashboard"}
              onClick={() => {
                setSelectedItem("Dashboard");
                navigate("/yt-studio/dashboard");
              }}
            />
            <SideBarItem
              icon={<FaChartBar />}
              text="Analytics"
              open={sideBarOpen}
              selected={selectedItem === "Analytics"}
              onClick={() => {
                setSelectedItem("Analytics");
                navigate("/yt-studio/analytics");
              }}
            />
            <SideBarItem
              icon={<FaVideo />}
              text="Content"
              open={sideBarOpen}
              selected={selectedItem === "Content"}
              onClick={() => {
                setSelectedItem("Content");
                navigate("/yt-studio/content");
              }}
            />
            <SideBarItem
              icon={<RiMoneyRupeeCircleFill />}
              text="Revenue"
              open={sideBarOpen}
              selected={selectedItem === "Revenue"}
              onClick={() => {
                setSelectedItem("Revenue");
                navigate("/yt-studio/revenue");
              }}
            />
          </nav>
        </aside>
        <aside className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] border-t border-neutral-800 flex justify-around items-center">
          <MobileBarItem
            icon={<FaTachometerAlt />}
            text="Dashboard"
            active={activeItem === "Dashboard"}
            onClick={() => {
              setActiveItem("Dashboard");
              navigate("/yt-studio/dashboard");
            }}
          />
          <MobileBarItem
            icon={<FaChartBar />}
            text="Analytics"
            active={activeItem === "Analytics"}
            onClick={() => {
              setActiveItem("Analytics");
              navigate("/yt-studio/analytics");
            }}
          />
          <MobileBarItem
            icon={<IoIosAddCircle size={36} />}
            active={activeItem === "+"}
            onClick={() => {
              setActiveItem("+");
              navigate("/create-content");
            }}
          />
          <MobileBarItem
            icon={<FaVideo />}
            text="Content"
            active={activeItem === "Content"}
            onClick={() => {
              setActiveItem("Content");
              navigate("/yt-studio/content");
            }}
          />
          <MobileBarItem
            icon={<RiMoneyRupeeCircleFill />}
            text="Revenue"
            active={activeItem === "Revenue"}
            onClick={() => {
              setActiveItem("Revenue");
              navigate("/yt-studio/revenue");
            }}
          />
        </aside>
        <main
          className={`flex-1 p-4 sm:p-6 pb-16 md:pb-6 overflow-y-auto transition-all duration-300 ${
            sideBarOpen ? "md:ml-60" : "md:ml-20"
          }`}
          style={{ paddingTop: "60px" }}
        >
          <Outlet />
          {open && <Profile setToggle={setOpen} />}{" "}
        </main>
      </div>
    </div>
  );
};

function SideBarItem({ icon, text, selected, onClick, open }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full px-2 py-2 rounded-lg transition-colors ${
        open ? "justify-start pl-4" : "justify-center"
      } ${selected ? "bg-neutral-800" : "hover:bg-neutral-800"} cursor-pointer`}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      {open && <span className="text-sm truncate font-medium">{text}</span>}
    </button>
  );
}

function MobileBarItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg w-full transition-colors justify-center ${
        active ? "text-white" : "text-gray-400 hover:text-white"
      } cursor-pointer`}
    >
      <span className={`text-2xl ${text ? "" : "mb-1.5"}`}>{icon}</span>{" "}
      {text && <span className="text-[10px]">{text}</span>}
    </button>
  );
}

export default YtStudio;
