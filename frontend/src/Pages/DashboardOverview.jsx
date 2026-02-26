import React, { useEffect, useState } from "react";
import {
  Award,
  Send,
  AlertCircle,
  Clock,
  TrendingUp,
  MoreVertical,
  FileText,
} from "lucide-react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardOverview = () => {
  const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;

  const [batches, setBatches] = useState([]);
  const [activityData, setActivityData] = useState([]);

  const [stats, setStats] = useState({
    totalCertificates: 0,
    deliveryRate: 0,
    failedRecords: 0,
    pendingRecords: 0,
  });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${baseURL}/batches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          const data = res.data.data;

          setBatches(data.slice(0, 3)); // recent 3
          calculateStats(data);
          buildActivityChart(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBatches();
  }, []);

  // ================= STATS =================
  const calculateStats = (data) => {
    let totalCertificates = 0;
    let totalValid = 0;
    let totalInvalid = 0;
    let totalPending = 0;

    data.forEach((batch) => {
      totalCertificates += batch.total_records || 0;
      totalValid += batch.valid_records || 0;
      totalInvalid += batch.invalid_records || 0;

      if (batch.status === "processing") {
        totalPending +=
          batch.total_records -
          batch.valid_records -
          batch.invalid_records;
      }
    });

    const deliveryRate =
      totalCertificates > 0
        ? ((totalValid / totalCertificates) * 100).toFixed(1)
        : 0;

    setStats({
      totalCertificates,
      deliveryRate,
      failedRecords: totalInvalid,
      pendingRecords: totalPending,
    });
  };

  // ================= CHART DATA =================
  const buildActivityChart = (data) => {
    const map = {};

    data.forEach((batch) => {
      const date = new Date(batch.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      if (!map[date]) {
        map[date] = 0;
      }

      map[date] += batch.valid_records || 0;
    });

    const chartArray = Object.keys(map).map((date) => ({
      name: date,
      uploads: map[date],
    }));

    setActivityData(chartArray.reverse());
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-500">
      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
        <StatCard
          label="Total Certificates"
          value={stats.totalCertificates.toLocaleString()}
          icon={<Award size={17} />}
        />

        <StatCard
          label="Delivery Rate"
          value={`${stats.deliveryRate}%`}
          icon={<Send size={17} />}
        />

        <StatCard
          label="Failed Records"
          value={stats.failedRecords.toLocaleString()}
          icon={<AlertCircle size={17} className="text-[#FF3B3B]" />}
        />

        <StatCard
          label="Pending Emails"
          value={stats.pendingRecords.toLocaleString()}
          icon={<Clock size={17} className="text-[#FF2D87]" />}
        />
      </div>

      {/* ================= ACTIVITY + DISTRIBUTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white border border-[#C6C6D0] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-extrabold">Generation Activity</h3>
              <p className="text-[10px] text-[#75757F]">
                Certificates generated per day
              </p>
            </div>
          </div>

          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F5F5F7"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#75757F", fontWeight: 600 }}
                />

                <YAxis hide />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="uploads"
                  stroke="#0066FF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-[#C6C6D0] rounded-xl p-5 shadow-sm flex flex-col">
          <h3 className="text-xs font-extrabold mb-6">
            Status Distribution
          </h3>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-35 h-35 rounded-full border-[12px] border-[#0066FF] border-t-[#FF3B3B] border-r-[#FF2D87] flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-black">Success</p>
                <p className="text-[10px]">{stats.deliveryRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT UPLOAD HISTORY ================= */}
      <div className="bg-white border border-[#E5E7EB] font-['poppins', sans-serif] rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">

  {/* Header */}
  <div className="p-6 border-b border-[#F1F1F4] flex justify-between items-center bg-gradient-to-r from-[#F8FAFF] to-white">
    <div>
      <h3 className="text-base font-semibold text-[#0066FF] tracking-tight">
        Recent Upload History
      </h3>
      <p className="text-xs text-[#6B7280] mt-1">
        Overview of your latest CSV uploads
      </p>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto flex justify-around">
  <table className="w-full text-sm ">
    <tbody className="divide-y divide-[#F3F4F6]">
      {batches.map((batch) => (
        <HistoryRow
          key={batch.id}
          name={batch.original_file_name}
          date={new Date(batch.created_at).toLocaleString()}
          count={`${batch.total_records} Records`}
          status={batch.status}
          statusColor={getStatusColor(batch.status)}
        />
      ))}
    </tbody>
  </table>
</div>

</div>
    </div>
  );
};

// ================= HELPERS =================
function getStatusColor(status) {
  if (status === "completed") return "text-[#0066FF]";
  if (status === "processing") return "text-[#FF2D87]";
  if (status === "failed") return "text-[#FF3B3B]";
  return "text-[#75757F]";
}

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-[#C6C6D0] p-4 rounded-xl hover:border-[#0066FF] transition-all text-[#0066FF]">
    <div className="flex justify-between mb-2 text-[#0066FF] ">
      <span className="text-xs font-bold text-[#0d1116] ">{label}</span>
      {icon}
    </div>
    <h2 className="text-xl font-extrabold">{value}</h2>
  </div>
);

const HistoryRow = ({ name, date, count, status, statusColor }) => (
  <tr className="hover:bg-[#F9FAFB] transition-all duration-200">
    <td className="px-6 py-4">
      <div className="flex items-start gap-3">
        <FileText size={16} className="mt-1 text-[#0066FF]" />
        <div>
          <p className="font-medium text-[#111827]">{name}</p>
          <p className="text-xs text-[#6B7280] mt-1">{date}</p>
        </div>
      </div>
    </td>

    <td className="px-6 py-4 text-sm font-medium text-[#374151]">
      {count}
    </td>

    <td className={`px-6 py-4 text-sm font-semibold ${statusColor}`}>
      {status}
    </td>

    <td className="px-6 py-4 text-right text-[#9CA3AF]">
      <MoreVertical size={16} />
    </td>
  </tr>
);

export default DashboardOverview;