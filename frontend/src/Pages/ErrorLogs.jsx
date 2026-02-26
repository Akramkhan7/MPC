import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
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

const ErrorLogs = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [batchId, setBatchId] = useState("");
  const [type, setType] = useState("All");

  const fetchErrors = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "http://localhost:5007/api/error-logs",
        {
          params: { page, batchId, type },
        }
      );

      setErrorLogs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, [page, batchId, type]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6 font-['poppins', sans-serif]">

      

      {/* ERROR LIST */}
      <div className="bg-white border border-[#C6C6D0] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-[#0A0A0F]">
          Recent Error Logs
        </h3>

        {errorLogs.length === 0 ? (
          <p className="text-[#75757F]">No errors found</p>
        ) : (
          errorLogs.map((log) => (
            <div
              key={log.id}
              className="group flex items-center justify-between p-4 bg-white border border-[#F5F5F7] rounded-2xl hover:border-[#FF3B3B]/30 hover:bg-[#FF3B3B]/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF3B3B]/10 flex items-center justify-center text-[#FF3B3B]">
                  <AlertCircle size={22} strokeWidth={2.5} />
                </div>

                <div className="grid grid-cols-4 gap-8">
                  <div>
                    <p className="text-xs font-black text-[#0A0A0F]">
                      Row {log.row_no}
                    </p>
                    <p className="text-[10px] text-[#75757F] font-bold uppercase">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-[9px] font-black text-[#75757F] uppercase tracking-widest mb-0.5">
                      Reason
                    </p>
                    <p className="text-xs font-bold text-[#FF3B3B] leading-tight">
                      {log.reason}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-black text-[#75757F] uppercase tracking-widest mb-0.5">
                      Type
                    </p>
                    <span className="inline-block px-2.5 py-1 bg-[#F5F5F7] rounded-md text-[9px] font-black text-[#44444F] group-hover:bg-white transition-colors">
                      {log.error_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorLogs;