import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import axios from "axios";

const CertificatesTable = () => {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;
  const [certificates, setCertificates] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 50,
    totalPages: 1,
  });

  // --- NEW STATE FOR PDF VIEWER ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); 

  useEffect(() => {
    fetchCertificates(1);
  }, []);

  const fetchCertificates = async (page) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseURL}/batches/candidates?page=${page}&limit=50&status=all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        const mapped = res.data.data.map((cert) => ({
          
          dbId: cert.certificateId, 
          
          id: cert.certificateNo || 'Pending', 
          
          name: cert.name,
          email: cert.email,
          grade: cert.grade,
          course: cert.course,
          
          genStatus: cert.certificateId ? "Generated" : (cert.status === "Valid" ? "Pending" : "Failed"),
          emailStatus: cert.status === "Valid" ? "Sent" : "Failed"
        }));

        setCertificates(mapped);
        setPagination(res.data.pagination || { page: 1, total: 0, limit: 50, totalPages: 1 });
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    }
  };

  // --- NEW LOGIC: VIEW PDF ---
const handleView = async (dbId) => {
  try {
    setLoadingAction(`view-${dbId}`);

    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${baseURL}/batches/certificates/${dbId}/download`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileUrl = URL.createObjectURL(file);

    setPdfUrl(fileUrl);
    setIsModalOpen(true);
  } catch (error) {
    console.error("Failed to load PDF:", error);
    alert("Certificate PDF is not available or hasn't been generated yet.");
  } finally {
    setLoadingAction(null);
  }
};

  // --- NEW LOGIC: DOWNLOAD PDF ---
  const handleDownload = async (dbId, certId) => {
  try {
    setLoadingAction(`download-${dbId}`);

    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${baseURL}/batches/certificates/${dbId}/download`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileUrl = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${certId}.pdf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  } catch (error) {
    console.error("Failed to download PDF:", error);
    alert("Failed to download the certificate.");
  } finally {
    setLoadingAction(null);
  }
};

  const closeModal = () => {
    setIsModalOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl); 
      setPdfUrl(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-['Poppins', sans-serif]">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-[#0A0A0F] font-['Poppins']">
          All Certificates
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75757F]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white border border-[#C6C6D0] rounded-xl text-sm focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 transition-all w-64 font-medium"
            />
          </div>
          <select className="px-4 py-2 bg-[#F5F5F7] border border-[#C6C6D0] rounded-xl text-sm font-bold text-[#44444F] outline-none hover:border-[#0066FF] transition-all cursor-pointer">
            <option>All Status</option>
            <option>Generated</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <select className="px-4 py-2 bg-[#F5F5F7] border border-[#C6C6D0] rounded-xl text-sm font-bold text-[#44444F] outline-none hover:border-[#0066FF] transition-all cursor-pointer">
            <option>All Email</option>
            <option>Sent</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#C6C6D0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#F5F5F7]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">
                  Name
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">
                  Email
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F] text-center">
                  Grade
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">
                  Course
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">
                  Cert ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">
                  Generated
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">
                  Email
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="hover:bg-[#F9FAFB] transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-[#0A0A0F]">
                    {cert.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#44444F]">
                    {cert.email}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#0A0A0F] text-center font-['Poppins']">
                    {cert.grade}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#44444F]">
                    {cert.course}
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono font-bold text-[#75757F] tracking-tighter">
                    {cert.id}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge type={cert.genStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge type={cert.emailStatus} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* ACTIONS WRAPPER - Updated with disabled states and onClick handlers */}
                    <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleView(cert.dbId)}
                        disabled={
                          loadingAction === `view-${cert.dbId}` ||
                          cert.genStatus !== "Generated"
                        }
                        className="p-1.5 text-[#44444F] hover:text-[#0066FF] hover:bg-[#0066FF]/5 rounded-lg transition-all disabled:opacity-50"
                        title="View PDF"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleDownload(cert.dbId, cert.id)}
                        disabled={
                          loadingAction === `download-${cert.dbId}` ||
                          cert.genStatus !== "Generated"
                        }
                        className="p-1.5 text-[#44444F] hover:text-[#0066FF] hover:bg-[#0066FF]/5 rounded-lg transition-all disabled:opacity-50"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>

                      <button className="p-1.5 text-[#75757F] hover:text-[#FF3B3B] hover:bg-[#FF3B3B]/5 rounded-lg transition-all">
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination dynamic */}
        <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#F5F5F7] flex items-center justify-between">
          <p className="text-xs text-[#75757F] font-bold uppercase tracking-tight">
            Showing Page {pagination.page} of {pagination.totalPages} (Total:{" "}
            {pagination.total})
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchCertificates(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-1.5 rounded-lg text-[#75757F] hover:bg-[#F5F5F7] transition-all disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button className="px-4 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-black shadow-md shadow-[#0066FF]/20">
              {pagination.page}
            </button>
            <button
              onClick={() => fetchCertificates(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-1.5 rounded-lg text-[#75757F] hover:bg-[#F5F5F7] transition-all disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- NEW UI: MODAL OVERLAY FOR PDF VIEWER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#C6C6D0] rounded-2xl shadow-2xl w-full max-w-5xl h-[96vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA]">
              <h3 className="font-extrabold text-[#0A0A0F] font-['Poppins']">
                Certificate Preview
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-[#75757F] hover:text-[#FF3B3B] hover:bg-[#FF3B3B]/10 rounded-xl transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 w-full bg-[#F5F5F7]">
              {pdfUrl ? (
                <iframe
                  src={`${pdfUrl}#toolbar=0`}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-[#75757F] font-bold uppercase tracking-widest text-xs">
                    Loading document...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ type }) => {
  const styles = {
    Generated: "bg-[#0066FF]/10 text-[#0066FF]",
    Sent: "bg-[#0066FF]/10 text-[#0066FF]",
    Pending: "bg-[#FF2D87]/10 text-[#FF2D87]",
    Failed: "bg-[#FF3B3B]/10 text-[#FF3B3B]",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[type] || "bg-[#F5F5F7] text-[#75757F]"}`}
    >
      {type}
    </span>
  );
};

export default CertificatesTable;
