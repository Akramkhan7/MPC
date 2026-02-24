import React from 'react';
import { CheckCircle2, Clock, XCircle, RotateCcw } from 'lucide-react';

const EmailStatus = () => {
  const logs = [
    { recipient: 'alice@example.com', name: 'Alice Johnson', id: 'RD-2026-001', status: 'Sent', sentAt: '2026-02-20 14:30', deliveredAt: '2026-02-20 14:31' },
    { recipient: 'bob@example.com', name: 'Bob Smith', id: 'NB-2026-002', status: 'Sent', sentAt: '2026-02-20 14:30', deliveredAt: '2026-02-20 14:32' },
    { recipient: 'charlie@example.com', name: 'Charlie Brown', id: 'PM-2026-003', status: 'Failed', sentAt: '2026-02-19 10:15', deliveredAt: '—' },
    { recipient: 'diana@example.com', name: 'Diana Prince', id: 'UD-2026-004', status: 'Pending', sentAt: '—', deliveredAt: '—' },
    { recipient: 'eve@example.com', name: 'Eve Williams', id: 'CC-2026-005', status: 'Pending', sentAt: '—', deliveredAt: '—' },
    { recipient: 'frank@example.com', name: 'Frank Miller', id: 'DS-2026-006', status: 'Sent', sentAt: '2026-02-18 09:00', deliveredAt: '2026-02-18 09:01' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-['Poppins', sans-serif]">
      
      {/* 1. Top Delivery Stat Cards: Updated colors and font */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MiniStat label="Sent" value="3" icon={<CheckCircle2 size={18} />} colorClass="text-[#0066FF]" />
        <MiniStat label="Pending" value="2" icon={<Clock size={18} />} colorClass="text-[#FF2D87]" />
        <MiniStat label="Failed" value="1" icon={<XCircle size={18} />} colorClass="text-[#FF3B3B]" />
      </div>

      {/* 2. Email Delivery Status Table: Updated border to Divider color (#C6C6D0) */}
      <div className="bg-white border border-[#C6C6D0] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#F5F5F7] flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-[#0A0A0F] font-['Poppins']">Email Delivery Status</h3>
          <div className="flex items-center gap-3">
             <select className="text-[10px] font-black bg-[#F5F5F7] border border-[#C6C6D0] rounded-xl px-4 py-2 outline-none text-[#44444F] transition-all hover:border-[#0066FF] cursor-pointer">
                <option>All Status</option>
                <option>Sent</option>
                <option>Pending</option>
                <option>Failed</option>
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
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-8 py-5 text-sm font-medium text-[#44444F]">{log.recipient}</td>
                  <td className="px-8 py-5 text-sm font-bold text-[#0A0A0F]">{log.name}</td>
                  <td className="px-8 py-5 text-[11px] font-mono font-bold text-[#75757F] tracking-tighter">{log.id}</td>
                  <td className="px-8 py-5">
                    <StatusBadge type={log.status} />
                  </td>
                  <td className="px-8 py-5 text-xs text-[#75757F] font-semibold">{log.sentAt}</td>
                  <td className="px-8 py-5 text-xs text-[#75757F] font-semibold">{log.deliveredAt}</td>
                  <td className="px-8 py-5 text-right">
                    {log.status === 'Failed' && (
                      <button className="flex items-center gap-1.5 ml-auto text-[10px] font-black text-white bg-[#0066FF] px-4 py-2 rounded-xl hover:bg-[#001A4D] hover:shadow-lg transition-all active:scale-95 uppercase tracking-wider">
                        <RotateCcw size={12} strokeWidth={3} />
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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
    <div className={`p-3 bg-[#F5F5F7] rounded-2xl ${colorClass} group-hover:bg-[#0066FF]/5 transition-colors`}>{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-[#75757F] uppercase tracking-[0.15em]">{label}</p>
      <h2 className="text-2xl font-extrabold text-[#0A0A0F] font-['Poppins', sans-serif]">{value}</h2>
    </div>
  </div>
);

const StatusBadge = ({ type }) => {
  const styles = {
    Sent: "bg-[#0066FF]/10 text-[#0066FF]",      // Electric Blue
    Pending: "bg-[#FF2D87]/10 text-[#FF2D87]",   // Secondary Pink
    Failed: "bg-[#FF3B3B]/10 text-[#FF3B3B]",    // Vibrant Red
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[type]}`}>
      {type}
    </span>
  );
};

export default EmailStatus;