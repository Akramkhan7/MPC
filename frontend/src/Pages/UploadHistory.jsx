import React from 'react';
import { FileText } from 'lucide-react';

const UploadHistory = () => {
  // Data mapped from the upload history design
  const historyData = [
    { name: 'batch_feb_20.csv', date: '2026-02-20', total: 150, success: 145, failed: 5 },
    { name: 'batch_feb_19.csv', date: '2026-02-19', total: 200, success: 192, failed: 8 },
    { name: 'batch_feb_18.csv', date: '2026-02-18', total: 80, success: 78, failed: 2 },
    { name: 'batch_feb_17.csv', date: '2026-02-17', total: 120, success: 110, failed: 10 },
    { name: 'batch_feb_15.csv', date: '2026-02-15', total: 95, success: 93, failed: 2 },
  ];

  return (
    <div className="bg-white border border-[#C6C6D0] rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-500 font-['poppins', sans-serif]">
      <div className="p-6 border-b border-[#F5F5F7]">
        <h3 className="text-sm font-extrabold text-[#0A0A0F] font-['Poppins', sans-serif]">Upload History</h3>
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
            {historyData.map((item, index) => (
              <tr key={index} className="hover:bg-[#F9FAFB] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F5F5F7] rounded-lg text-[#0A0A0F] group-hover:bg-[#0066FF]/10 group-hover:text-[#0066FF] transition-colors">
                        <FileText size={16} />
                    </div>
                    <span className="text-sm font-bold text-[#0A0A0F]">{item.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-[#44444F] font-semibold">{item.date}</td>
                <td className="px-8 py-5 text-sm font-extrabold text-[#0A0A0F] font-['Poppins']">{item.total}</td>
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
                  <button className="text-[10px] font-black uppercase tracking-wider text-white bg-[#0066FF] border border-transparent px-5 py-2 rounded-xl hover:bg-[#001A4D] hover:shadow-lg hover:shadow-[#0066FF]/20 transition-all active:scale-95">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadHistory;