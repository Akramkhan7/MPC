import React from 'react';
import { Search, Eye, Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const CertificatesTable = () => {
  const certificates = [
    { id: 'RD-2026-001', name: 'Alice Johnson', email: 'alice@example.com', grade: 'A+', course: 'React Development', genStatus: 'Generated', emailStatus: 'Sent' },
    { id: 'NB-2026-002', name: 'Bob Smith', email: 'bob@example.com', grade: 'A', course: 'Node.js Backend', genStatus: 'Generated', emailStatus: 'Sent' },
    { id: 'PM-2026-003', name: 'Charlie Brown', email: 'charlie@example.com', grade: 'B+', course: 'Python ML', genStatus: 'Generated', emailStatus: 'Failed' },
    { id: 'UD-2026-004', name: 'Diana Prince', email: 'diana@example.com', grade: 'A+', course: 'UI/UX Design', genStatus: 'Pending', emailStatus: 'Pending' },
    { id: 'CC-2026-005', name: 'Eve Williams', email: 'eve@example.com', grade: 'B', course: 'Cloud Computing', genStatus: 'Failed', emailStatus: 'Pending' },
    { id: 'DS-2026-006', name: 'Frank Miller', email: 'frank@example.com', grade: 'A', course: 'Data Science', genStatus: 'Generated', emailStatus: 'Sent' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-['Poppins', sans-serif]">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-[#0A0A0F] font-['Poppins']">All Certificates</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input: Updated border and focus to Primary Blue (#0066FF) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75757F]" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-white border border-[#C6C6D0] rounded-xl text-sm focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 transition-all w-64 font-medium"
            />
          </div>

          {/* Filter Dropdowns: Updated surface to Secondary Surface (#F5F5F7) */}
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

      {/* Main Table Container: Updated border to Divider color (#C6C6D0) */}
      <div className="bg-white border border-[#C6C6D0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Header: Updated background and text labels (#75757F) */}
              <tr className="bg-[#FAFAFA] border-b border-[#F5F5F7]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F] text-center">Grade</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">Course</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">Cert ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">Generated</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F]">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#75757F] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-[#0A0A0F]">{cert.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#44444F]">{cert.email}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#0A0A0F] text-center font-['Poppins']">{cert.grade}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#44444F]">{cert.course}</td>
                  <td className="px-6 py-4 text-[11px] font-mono font-bold text-[#75757F] tracking-tighter">{cert.id}</td>
                  <td className="px-6 py-4">
                    <StatusBadge type={cert.genStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge type={cert.emailStatus} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#44444F] hover:text-[#0066FF] hover:bg-[#0066FF]/5 rounded-lg transition-all">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-[#44444F] hover:text-[#0066FF] hover:bg-[#0066FF]/5 rounded-lg transition-all">
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

        {/* Pagination: Updated current page to Primary Blue (#0066FF) */}
        <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#F5F5F7] flex items-center justify-between">
          <p className="text-xs text-[#75757F] font-bold uppercase tracking-tight">1 to 8 of 142 entries</p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg text-[#75757F] hover:bg-[#F5F5F7] transition-all disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button className="px-4 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-black shadow-md shadow-[#0066FF]/20">1</button>
            <button className="px-4 py-1.5 rounded-xl hover:bg-[#F5F5F7] text-xs font-bold text-[#44444F] transition-all">2</button>
            <button className="p-1.5 rounded-lg text-[#75757F] hover:bg-[#F5F5F7] transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated StatusBadge using your design palette: Blue, Pink, and Red
const StatusBadge = ({ type }) => {
  const styles = {
    Generated: "bg-[#0066FF]/10 text-[#0066FF]", // Primary Blue
    Sent: "bg-[#0066FF]/10 text-[#0066FF]",      // Primary Blue
    Pending: "bg-[#FF2D87]/10 text-[#FF2D87]",   // Secondary Pink
    Failed: "bg-[#FF3B3B]/10 text-[#FF3B3B]",    // Error Red
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[type] || 'bg-[#F5F5F7] text-[#75757F]'}`}>
      {type}
    </span>
  );
};

export default CertificatesTable;