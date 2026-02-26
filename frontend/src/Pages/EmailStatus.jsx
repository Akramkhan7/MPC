import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, XCircle, RotateCcw } from "lucide-react";

const EmailStatus = ({ batchId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Status");
  const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${baseURL}/batches/emaillogs`;
        const response = await fetch(url,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        const result = await response.json();

        if (result.success) {
          setLogs(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch email logs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [batchId]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return d
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  // Calculate stats dynamically
  const stats = {
    sent: logs.filter((l) => l.status === "Sent").length,
    pending: logs.filter((l) => l.status === "Pending").length,
    failed: logs.filter((l) => l.status === "Failed").length,
  };

  // Handle dropdown filtering
  const filteredLogs = logs.filter((log) => {
    if (filter === "All Status") return true;
    return log.status === filter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-['Poppins', sans-serif]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MiniStat
          label="Sent"
          value={stats.sent}
          icon={<CheckCircle2 size={18} />}
          colorClass="text-[#0066FF]"
        />
        <MiniStat
          label="Pending"
          value={stats.pending}
          icon={<Clock size={18} />}
          colorClass="text-[#FF2D87]"
        />
        <MiniStat
          label="Failed"
          value={stats.failed}
          icon={<XCircle size={18} />}
          colorClass="text-[#FF3B3B]"
        />
      </div>

      <div className="bg-white border border-[#C6C6D0] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#F5F5F7] flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-[#0A0A0F] font-['Poppins']">
            Email Delivery Status
          </h3>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-[10px] font-black bg-[#F5F5F7] border border-[#C6C6D0] rounded-xl px-4 py-2 outline-none text-[#44444F] transition-all hover:border-[#0066FF] cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Sent">Sent</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAFAFA] text-[10px] font-bold text-[#75757F] uppercase tracking-widest">
                <th className="px-8 py-4">Recipient</th>
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Cert ID</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Sent At</th>
                <th className="px-8 py-4">Delivered At</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-8 py-10 text-center text-sm text-[#75757F]"
                  >
                    Loading logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-8 py-10 text-center text-sm text-[#75757F]"
                  >
                    No email logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <td className="px-8 py-5 text-sm font-medium text-[#44444F]">
                      {log.recipient}
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-[#0A0A0F]">
                      {log.name}
                    </td>
                    <td className="px-8 py-5 text-[11px] font-mono font-bold text-[#75757F] tracking-tighter">
                      {log.id}
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge type={log.status} />
                      {/* Show a tiny tooltip/text if there is an error message */}
                      {log.errorMessage && (
                        <p
                          className="text-[9px] text-red-500 mt-1 max-w-[120px] truncate"
                          title={log.errorMessage}
                        >
                          {log.errorMessage}
                        </p>
                      )}
                    </td>
                    <td className="px-8 py-5 text-xs text-[#75757F] font-semibold">
                      {formatDate(log.sentAt)}
                    </td>
                    <td className="px-8 py-5 text-xs text-[#75757F] font-semibold">
                      {log.status === "Sent" ? formatDate(log.sentAt) : "—"}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {log.status === "Failed" && (
                        <button
                          className="flex items-center gap-1.5 ml-auto text-[10px] font-black text-white bg-[#0066FF] px-4 py-2 rounded-xl hover:bg-[#001A4D] hover:shadow-lg transition-all active:scale-95 uppercase tracking-wider"
                          onClick={() =>
                            console.log(
                              `Trigger retry for candidate ${log.recipient}`,
                            )
                          }
                        >
                          <RotateCcw size={12} strokeWidth={3} />
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-components: Using Secondary Surface (#F5F5F7) and Bold Fonts
const MiniStat = ({ label, value, icon, colorClass }) => (
  <div className="bg-white border border-[#C6C6D0] p-6 rounded-2xl flex items-center gap-5  hover:border-[#0066FF] transition-all group">
    <div
      className={`p-3 bg-[#F5F5F7] rounded-2xl ${colorClass} group-hover:bg-[#0066FF]/5 transition-colors`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-[#75757F] uppercase tracking-[0.15em]">
        {label}
      </p>
      <h2 className="text-2xl font-extrabold text-[#0A0A0F] font-['Poppins', sans-serif]">
        {value}
      </h2>
    </div>
  </div>
);

const StatusBadge = ({ type }) => {
  const styles = {
    Sent: "bg-[#0066FF]/10 text-[#0066FF]", // Electric Blue
    Pending: "bg-[#FF2D87]/10 text-[#FF2D87]", // Secondary Pink
    Failed: "bg-[#FF3B3B]/10 text-[#FF3B3B]", // Vibrant Red
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[type]}`}
    >
      {type}
    </span>
  );
};

export default EmailStatus;
