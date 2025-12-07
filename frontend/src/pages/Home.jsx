import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/yt_icon.png";
import { IoIosSearch } from "react-icons/io";
import { AiFillAudio } from "react-icons/ai";
import { FaMicrophone, FaSearch, FaTimes, FaUserCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { RiPlayList2Fill } from "react-icons/ri";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import Profile from "../components/Profile";
import DisplayVideosInHomePage from "../components/DisplayVideosInHomePage";
import DisplayShortsInHomePage from "../components/DisplayShortsInHomePage";
import { useSubscribedContentStore } from "../store/useSubscribedContentStore";
import { useRef } from "react";
import { showCustomAlert } from "../components/CustomAlert";
import axios from "axios";
import { serverURL } from "../App";
import { ClipLoader } from "react-spinners";
import SearchResults from "./SearchResults";
import FilterResults from "./FilterResults";
import RecommendedContent from "./RecommendedContent";

const Home = () => {
  const { subscribedChannels } = useSubscribedContentStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { loggedInUserData } = useUserStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home"); // for desktop
  const [activeItem, setActiveItem] = useState("Home"); // for mobile

  const [toggle, setToggle] = useState(false);

  const [popup, setPopup] = useState(false);

  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const recoginitionRef = useRef();

  function speak(message) {
    const speech = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speech);
  }

  if (
    !recoginitionRef.current &&
    (window.speechRecognition || window.webkitSpeechRecognition)
  ) {
    const speechRecognition =
      window.speechRecognition || window.webkitSpeechRecognition;
    recoginitionRef.current = new speechRecognition();
    recoginitionRef.current.continuous = false;
    recoginitionRef.current.interimResults = false;
    recoginitionRef.current.lang = "en-US";
  }

  const handleSearch = async () => {
    if (!recoginitionRef.current) {
      showCustomAlert("Speech recognition is not supported in your browser!");
      return;
    }
    if (listening) {
      recoginitionRef.current.stop();
      setListening(false);
      return;
    }
    setListening(true);
    recoginitionRef.current.start();
    recoginitionRef.current.onresult = async (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      await handleSearchData(transcript);
      setListening(false);
    };
    recoginitionRef.current.onerror = async (e) => {
      console.error("Recognition error: ", e);
      setListening(false);
      if (e.error === "no-speech") {
        showCustomAlert("No speech detected! Please try again.");
      } else {
        showCustomAlert("Voice search failed! Please try again.");
      }
    };
    recoginitionRef.current.onend = () => {
      setListening(false);
    };
  };

  const handleSearchData = async (query) => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/content/search`,
        { input: query },
        { withCredentials: true }
      );
      console.log(result.data);
      setSearchData(result.data);
      setInput("");
      setPopup(false);

      const {
        videos = [],
        shorts = [],
        playlists = [],
        channels = [],
      } = result.data;

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        playlists.length > 0 ||
        channels.length > 0
      ) {
        speak("Here are the search results");
      } else {
        speak("No results found");
      }
    } catch (error) {
      console.log(error.message);
      showCustomAlert("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    try {
      const result = await axios.post(
        `${serverURL}/api/content/filter-category`,
        { input: category },
        { withCredentials: true }
      );

      const { videos = [], shorts = [], channels = [] } = result.data;

      let channelVideos = [];
      let channelShorts = [];

      channels.forEach((channel) => {
        if (channel.videos?.length) channelVideos.push(...channel.videos);
        if (channel.shorts?.length) channelShorts.push(...channel.shorts);
      });

      setFilterData({
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });
      navigate("/");

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        channelVideos.length > 0 ||
        channelShorts.length > 0
      ) {
        speak(`Here are the ${category} results`);
      } else {
        speak("No results found");
      }
    } catch (error) {
      console.log(error.message);
      showCustomAlert("Something went wrong! Please try again.");
    }
  };

  const categories = [
    "All",
    "Music",
    "Gaming",
    "News",
    "Entertainment",
    "Sports",
    "Movies",
    "Live",
    "DSA",
    "Science & Tech",
    "TV Shows",
    "Art",
    "Comedy",
    "Vlogs",
    "Education",
    "Gadgets",
    "Health",
    "Horror",
    "Cooking",
    "Dance",
    "Fashion",
    "Travel",
    "Beauty",
    "DIY & Crafts",
    "Animals & Pets",
    "Automotive",
    "Animation",
    "Documentary",
    "History",
    "Finance & Business",
    "Fitness",
    "How-to & Style",
    "People & Blogs",
    "Trailers",
    "ASMR",
    "Podcasts",
    "Reviews",
    "Tutorials",
    "Unboxing",
    "Challenges",
    "Pranks",
    "Family",
    "Nature & Outdoors",
    "Photography",
    "Filmmaking",
    "Real Estate",
    "Spirituality",
    "Motivation",
    "Coding & Programming",
    "Web Development",
    "Mobile Development",
  ];
  return (
    <div className="bg-[#0f0f0f] min-h-screen relative text-white">
      {/* Search Popup */}
      {popup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-[400px] sm:min-h-[480px] p-8 flex flex-col items-center justify-center gap-8 relative border border-gray-700 transition-all duration-300 ">
            <button
              className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={() => setPopup(false)}
            >
              <FaTimes size={20} />
            </button>
            <div className="flex flex-col gap-4 items-center">
              {listening ? (
                <h1 className="text-lg sm:text-xl font-semibold text-red-300 animate-pulse">
                  Listening...
                </h1>
              ) : (
                <h1 className="text-lg sm:text-xl font-semibold text-gray-300">
                  Speak or type your query
                </h1>
              )}
            </div>
            <div className="flex w-full gap-2 md:hidden mt-4">
              <input
                type="text"
                placeholder="Search..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border border-gray-700 focus:border-red-600 fouc:ring-1 focus:ring-red-600 transition duration-300 ease-in-out"
              />
              <button
                onClick={() => handleSearchData(input)}
                className="bg-[#272727] p-3 rounded-full cursor-pointer hover:bg-zinc-700 transition duration-300 ease-in-out border border-gray-700"
              >
                {loading ? (
                  <ClipLoader size={18} color="white" />
                ) : (
                  <IoIosSearch size={20} />
                )}
              </button>
            </div>
            <div
              onClick={handleSearch}
              className="p-8 rounded-full shadow-xl transition-all cursor-pointer duration-300 transform hover:scale-110 bg-red-600 hover:bg-red-700 shadow-red-600/40"
            >
              <FaMicrophone size={20} />
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="h-15 p-4 border-b-1 flex items-center border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between w-full">
          {/* left section */}
          <div className="flex items-center gap-5">
            <button
              className="hidden md:flex text-xl bg-[#272727] p-2 rounded-full cursor-pointer hover:bg-zinc-700 transition duration-300 ease-in-out"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <RxHamburgerMenu color="white" size={20} />
            </button>
            <div className="flex items-center">
              <img src={logo} alt="" className="w-10" />
              <span className="font-roboto text-2xl tracking-tighter ">
                YouTube
              </span>
            </div>
          </div>

          {/* middle section */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1 items-center">
              <input
                type="text"
                placeholder="Search..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700"
              />
              <button
                onClick={() => handleSearchData(input)}
                className="bg-[#272727] p-2 rounded-r-full cursor-pointer hover:bg-zinc-700 transition duration-300 ease-in-out border border-gray-700"
              >
                {loading ? (
                  <ClipLoader size={18} color="white" />
                ) : (
                  <IoIosSearch size={24} />
                )}
              </button>
            </div>
            <button
              onClick={() => setPopup(!popup)}
              className="bg-[#272727] p-2 rounded-full cursor-pointer hover:bg-zinc-700 transition duration-300 ease-in-out"
            >
              <AiFillAudio size={23} />
            </button>
          </div>

          {/* right section */}
          <div className="flex items-center gap-3">
            {loggedInUserData?.channel && (
              <button
                onClick={() => navigate("/create-content")}
                className="bg-[#272727] rounded-full cursor-pointer hidden px-4 py-1 md:flex gap-1 hover:bg-zinc-700 transition duration-300 ease-in-out items-center"
              >
                <span className="text-xl">+</span>
                <span className="text-sm">Create</span>
              </button>
            )}
            {loggedInUserData ? (
              <img
                src={loggedInUserData?.photoUrl}
                onClick={(e) => {
                  e.stopPropagation();
                  setToggle(!toggle);
                }}
                className="w-7 h-7 object-cover rounded-full hidden md:flex cursor-pointer"
              />
            ) : (
              <FaUserCircle
                onClick={(e) => {
                  e.stopPropagation();
                  setToggle(!toggle);
                }}
                className="text-3xl hidden md:flex cursor-pointer text-gray-500"
              />
            )}
            <FaSearch
              onClick={() => setPopup(!popup)}
              className="text-lg md:hidden flex"
            />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 left-0 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col overflow-y-auto`}
      >
        <nav className="space-y-2 mt-5">
          <SideBarItem
            icon={<FaHome />}
            text="Home"
            open={sidebarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
          />
          <SideBarItem
            icon={<SiYoutubeshorts />}
            text="Shorts"
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />
          <SideBarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {
              setSelectedItem("Subscriptions");
              navigate("/subscriptions");
            }}
          />
        </nav>
        <hr className="my-3 border-gray-800" />
        {sidebarOpen && <p className="text-md text-gray-400 px-4">You</p>}
        <nav className="space-y-2 mt-4">
          <SideBarItem
            icon={<FaHistory />}
            text="History"
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => {
              setSelectedItem("History");
              navigate("/history");
            }}
          />
          <SideBarItem
            icon={<RiPlayList2Fill />}
            text="Playlist"
            open={sidebarOpen}
            selected={selectedItem === "Playlist"}
            onClick={() => {
              setSelectedItem("Playlist");
              navigate("/saved-playlist");
            }}
          />
          <SideBarItem
            icon={<GoVideo />}
            text="Saved Videos"
            open={sidebarOpen}
            selected={selectedItem === "Saved Videos"}
            onClick={() => {
              setSelectedItem("Saved Videos");
              navigate("/saved-content");
            }}
          />
          <SideBarItem
            icon={<FaThumbsUp />}
            text="Liked Videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => {
              setSelectedItem("Liked Videos");
              navigate("/liked-content");
            }}
          />
        </nav>
        <hr className="my-3 border-gray-800" />
        {sidebarOpen && (
          <p className="text-md text-gray-400 px-4">Subscriptions</p>
        )}
        <div className="space-y-2 mt-4">
          {subscribedChannels?.map((channel) => (
            <button
              key={channel?._id}
              onClick={() => {
                setSelectedItem(channel?._id);
                navigate(`/channel-page/${channel?._id}`);
              }}
              className={`flex items-center w-full text-left bg-[#121212] cursor-pointer p-2 rounded-lg transition ${
                sidebarOpen ? "gap-3 justify-start" : "justify-center"
              } ${
                selectedItem === channel?._id
                  ? "bg-[#272727]"
                  : "hover:bg-[#272727]"
              }`}
            >
              <img
                src={channel?.avatar}
                className="w-5 h-5 object-cover rounded-full"
                alt=""
              />
              {sidebarOpen && (
                <span className="text-sm truncate">{channel?.name}</span>
              )}
            </button>
          ))}
        </div>
        <nav className="space-y-2 mt-4"></nav>
      </aside>

      {/* Mobile BottomBar */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] border-t border-gray-800 flex justify-around items-center py-2">
        <MobileBarItem
          icon={<FaHome />}
          text="Home"
          active={activeItem === "Home"}
          onClick={() => {
            setActiveItem("Home");
            navigate("/");
          }}
        />
        <MobileBarItem
          icon={<SiYoutubeshorts />}
          text="Shorts"
          active={activeItem === "Shorts"}
          onClick={() => {
            setActiveItem("Shorts");
            navigate("/shorts");
          }}
        />
        <MobileBarItem
          icon={<IoIosAddCircle size={40} />}
          active={activeItem === "+"}
          onClick={() => {
            setActiveItem("+");
            navigate("/create-content");
          }}
        />
        <MobileBarItem
          icon={<MdOutlineSubscriptions />}
          text="Subscriptions"
          active={activeItem === "Subscriptions"}
          onClick={() => {
            setActiveItem("Subscriptions");
            navigate("/subscriptions");
          }}
        />
        <MobileBarItem
          icon={
            loggedInUserData?.photoUrl ? (
              <img
                src={loggedInUserData?.photoUrl}
                className="w-6 h-6 object-cover rounded-full"
              />
            ) : (
              <FaUserCircle />
            )
          }
          text="You"
          active={activeItem === "You"}
          onClick={() => {
            setActiveItem("You");
            navigate("/mobileProfileView");
          }}
        />
      </aside>

      {/* Profile of loggedInUser */}
      {toggle && <Profile setToggle={setToggle} />}

      {/* Main Content */}
      <main
        className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        {location.pathname === "/" && (
          <div className="flex pt-2 scrollbar-hide mt-[56px] items-center gap-2 overflow-x-auto">
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleCategoryFilter(category);
                  setSelectedCategory(category);
                }}
                className={`px-4 py-1.5 rounded-lg cursor-pointer transition duration-200 ease-in-out text-sm whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-white text-black"
                    : "bg-[#272727] text-white hover:bg-neutral-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        <div>
          {location.pathname === "/" && searchData && (
            <SearchResults key={location.key} searchResults={searchData} />
          )}
          {location.pathname === "/" && filterData && (
            <FilterResults key={location.key} filterResults={filterData} />
          )}
          {location.pathname === "/" && loggedInUserData && (
            <RecommendedContent key={location.key} />
          )}
          {location.pathname === "/" && !loggedInUserData && (
            <DisplayVideosInHomePage key={location.key} />
          )}
          {location.pathname === "/" && !loggedInUserData && (
            <DisplayShortsInHomePage key={location.key} />
          )}
        </div>
        <div className="mt-17">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function SideBarItem({ icon, text, selected, onClick, open }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-2 rounded w-full transition-colors ${
        open ? "justify-start" : "justify-center"
      } ${
        selected
          ? "bg-[#272727]"
          : "bg-[#121212] hover:bg-zinc-800 transition duration-300 ease-in-out"
      } cursor-pointer`}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </button>
  );
}

function MobileBarItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg w-full transition-all duration-300 justify-center ${
        active
          ? "text-white"
          : "text-gray-400 hover:text-white transition duration-300 ease-in-out scale-105"
      } cursor-pointer`}
    >
      <span className="text-2xl">{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
}

export default Home;
