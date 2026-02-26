import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import axios from "axios";

const UploadHistory = () => {
  const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;
  const [historyData, setHistoryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batchPreview, setBatchPreview] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

const handleViewDetails = async (batchId) => {
  try {
    setLoadingPreview(true);
    setIsModalOpen(true);

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${baseURL}/batches/${batchId}/candidates?page=1&limit=200&status=all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      // 🔥 MAP BACKEND DATA TO UI FORMAT
      const formatted = res.data.data.map((item) => ({
        row: item.row_no ?? "-",
        name: item.name ?? "-",
        email: item.email ?? "-",
        grade: item.grade ?? "-",
        course: item.course ?? "-",
        status:
          item.validation_status === "valid"
            ? "Valid"
            : item.validation_status === "invalid"
            ? "Invalid"
            : "-",
      }));

      setBatchPreview(formatted);
    }
  } catch (error) {
    console.error("Failed to load batch preview:", error);
  } finally {
    setLoadingPreview(false);
  }
};

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
          // map backend data to UI format
          const mappedData = res.data.data.map((batch) => ({
            id: batch.id,
            name: batch.original_file_name,
            date: new Date(batch.created_at).toISOString().split("T")[0],
            total: batch.total_records,
            success: batch.valid_records,
            failed: batch.invalid_records,
          }));

          setHistoryData(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch batches:", error);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div className="bg-white border border-[#C6C6D0] rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-500 font-['poppins', sans-serif]">
      <div className="p-6 border-b border-[#F5F5F7]">
        <h3 className="text-sm font-extrabold text-[#0A0A0F] font-['Poppins', sans-serif]">
          Upload History
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#FAFAFA] text-[10px] font-bold text-[#75757F] uppercase tracking-widest font-['Poppins', sans-serif]">
              <th className="px-8 py-4 text-[#0066FF]">File Name</th>
              <th className="px-8 py-4">Upload Date</th>
              <th className="px-8 py-4">Total Records</th>
              <th className="px-8 py-4">Success</th>
              <th className="px-8 py-4">Failed</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F5F5F7]">
            {historyData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#F9FAFB] transition-colors group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F5F5F7] rounded-lg text-[#0A0A0F] group-hover:bg-[#0066FF]/10 group-hover:text-[#0066FF] transition-colors">
                      <FileText size={16} />
                    </div>
                    <span className="text-sm font-bold text-[#0A0A0F]">
                      {item.name}
                    </span>
                  </div>
                </td>

                <td className="px-8 py-5 text-sm text-[#44444F] font-semibold">
                  {item.date}
                </td>

                <td className="px-8 py-5 text-sm font-extrabold text-[#0A0A0F] font-['Poppins']">
                  {item.total}
                </td>

                <td className="px-8 py-5">
                  <span className="px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-[11px] font-black uppercase tracking-wider">
                    {item.success}
                  </span>
                </td>

                <td className="px-8 py-5">
                  <span className="px-3 py-1 rounded-full bg-[#FF3B3B]/10 text-[#FF3B3B] text-[11px] font-black uppercase tracking-wider">
                    {item.failed}
                  </span>
                </td>

                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => handleViewDetails(item.id)}
                    className="text-[10px] font-black uppercase tracking-wider text-white bg-[#0066FF] border border-transparent px-5 py-2 rounded-xl hover:bg-[#001A4D] hover:shadow-lg hover:shadow-[#0066FF]/20 transition-all active:scale-95"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0F]/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#C6C6D0] rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA]">
              <h3 className="font-extrabold text-[#0A0A0F]">Batch Preview</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setBatchPreview([]);
                }}
                className="text-[#FF3B3B] font-bold"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-[#F5F5F7]">
              {loadingPreview ? (
                <p className="text-center font-bold">Loading...</p>
              ) : (
                <table className="w-full text-sm border bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Row</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Grade</th>
                      <th className="border p-2">Course</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchPreview.map((row, index) => (
                      <tr key={index}>
                        <td className="border p-2">{row.row}</td>
                        <td className="border p-2">{row.name}</td>
                        <td className="border p-2">{row.email}</td>
                        <td className="border p-2">{row.grade}</td>
                        <td className="border p-2">{row.course}</td>

                        <td
                          className={`border p-2 ${
                            row.status === "Valid"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {row.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadHistory;
