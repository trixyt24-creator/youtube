import { useChannelStore } from "../store/useChannelStore";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function calculateRevenue(views, type) {
  if (type === "video") {
    return views * 0.01;
  } else if (type === "short") {
    return views * 0.005;
  } else return 0;
}

const Analytics = () => {
  const { channelData } = useChannelStore();

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-white">
        <h2 className="text-2xl text-gray-400 font-semibold">
          Loading channel data...
        </h2>
      </div>
    );
  }

  // video Revenue data
  const videoRevenueData = (channelData.videos || []).map((video) => ({
    title:
      video.title.length > 10 ? video.title.slice(0, 15) + "..." : video.title,
    revenue: calculateRevenue(video.views || 0, "video"),
  }));

  // short Revenue data
  const shortRevenueData = (channelData.shorts || []).map((short) => ({
    title:
      short.title.length > 10 ? short.title.slice(0, 15) + "..." : short.title,
    revenue: calculateRevenue(short.views || 0, "short"),
  }));

  const totalRevenue =
    videoRevenueData.reduce((acc, video) => acc + video.revenue, 0) +
    shortRevenueData.reduce((acc, short) => acc + short.revenue, 0);

  return (
    <div className="w-full bg-[#0f0f0f] min-h-screen p-4 sm:p-6 text-white space-y-8 mb-16 md:mb-0">
      <h1 className="text-2xl font-semibold">Channel Revenue</h1>

      {/* --- Video Chart --- */}
      <div className="bg-[#181818] border border-neutral-800 rounded-lg p-4 shadow-md overflow-hidden">
        {" "}
        <h2 className="text-lg font-semibold mb-4 text-gray-300">
          Video Revenue
        </h2>
        {videoRevenueData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={videoRevenueData}
                margin={{ top: 5, right: 20, left: -10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#373737" />
                <XAxis
                  dataKey="title"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip
                  cursor={{ stroke: "#555", strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "rgba(20, 20, 20, 0.9)",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    fontSize: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  labelStyle={{ color: "#ccc", fontWeight: "bold" }}
                  itemStyle={{ color: "#FF0000" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF0000"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#FF0000", stroke: "#FF0000" }}
                  dot={{ r: 3, fill: "#FF0000", stroke: "none" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No video data available.
          </p>
        )}
      </div>

      {/* --- Short Chart --- */}
      <div className="bg-[#181818] border border-neutral-800 rounded-lg p-4 shadow-md overflow-hidden">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">
          Short Revenue
        </h2>
        {shortRevenueData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={shortRevenueData}
                margin={{ top: 5, right: 20, left: -10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#373737" />
                <XAxis
                  dataKey="title"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip
                  cursor={{ stroke: "#555", strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "rgba(20, 20, 20, 0.9)",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    fontSize: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  labelStyle={{ color: "#ccc", fontWeight: "bold" }}
                  itemStyle={{ color: "#FF0000" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF0000"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#FF0000", stroke: "#FF0000" }}
                  dot={{ r: 3, fill: "#FF0000", stroke: "none" }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-center mt-5">
              <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No short data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
