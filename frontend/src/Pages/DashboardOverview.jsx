import React from 'react';
import { 
  Award, Send, AlertCircle, Clock, TrendingUp, 
  MoreVertical, FileText, CheckCircle2, Loader2, XCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the Activity Chart
const activityData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 55 },
  { name: 'Wed', value: 48 },
  { name: 'Thu', value: 62 },
  { name: 'Fri', value: 75 },
  { name: 'Sat', value: 68 },
  { name: 'Sun', value: 85 },
];

const DashboardOverview = () => {
  return (
    <div className="space-y-7 animate-in fade-in duration-500">
      
      {/* 1. Top Stats Row - Updated hover colors to Primary Blue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Certificates" value="12,840" change="+12%" icon={<Award size={17} />} />
        <StatCard label="Delivery Rate" value="99.2%" change="+0.4%" icon={<Send size={17} />} />
        {/* Failed Records uses Error Red (#FF3B3B) */}
        <StatCard label="Failed Records" value="24" icon={<AlertCircle size={17} className="text-[#FF3B3B]" />} />
        {/* Pending Emails uses Tertiary Yellow (#FFE500) */}
        <StatCard label="Pending Emails" value="142" icon={<Clock size={17} className="text-[#FF2D87]" />} />
      </div>

      {/* 2. Middle Row: Activity & Distribution */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white border border-[#C6C6D0] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <h3 className="text-xs font-extrabold text-[#0A0A0F] tracking-tight">Generation Activity</h3>
              <p className="text-[10px] text-[#75757F] font-medium">Daily certificate output</p>
            </div>
            <select className="text-[10px] font-bold bg-[#F5F5F7] border-none rounded-md px-2 py-1 outline-none text-[#0A0A0F]">
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#75757F', fontWeight: 600}} 
                  dy={8} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0066FF" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-[#C6C6D0] rounded-xl p-5 shadow-sm flex flex-col">
          <h3 className="text-xs font-extrabold text-[#0A0A0F] tracking-tight mb-6">Status Distribution</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-35 h-35 rounded-full border-[12px] border-[#0066FF] border-t-[#FF3B3B] border-r-[#FF2D87] flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-black text-[#0A0A0F]">85%</p>
                <p className="text-[8px] text-[#0066FF] font-bold uppercase tracking-wider">Success</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 w-full">
              <div className="text-center">
                <p className="text-[11px] font-bold text-[#0066FF]">85%</p>
                <p className="text-[9px] text-[#75757F] font-medium">Delivered</p>
              </div>
              <div className="text-center border-x border-[#F5F5F7]">
                <p className="text-[11px] font-bold text-[#FF2D87]">12%</p>
                <p className="text-[9px] text-[#75757F] font-medium">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-[#FF3B3B]">3%</p>
                <p className="text-[9px] text-[#75757F] font-medium">Failed</p>
              </div>
            </div>
          </div>
        </div>
      </div>  */}


      <div className="bg-white border border-[#C6C6D0] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#F5F5F7] flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#0A0A0F]">Recent Upload History</h3>
          <button className="text-xs font-bold text-[#0066FF] hover:underline">View All History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAFAFA] text-[10px] font-bold text-[#75757F] uppercase tracking-widest">
                <th className="px-8 py-4">Batch Filename</th>
                <th className="px-8 py-4">Total Records</th>
                <th className="px-8 py-4">Current Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              <HistoryRow name="q3_internship_certificates.csv" date="Oct 24, 2023 • 14:20" count="450 Records" status="Completed" statusColor="text-[#0066FF]" />
              <HistoryRow name="web_dev_bootcamp_v2.csv" date="Oct 23, 2023 • 09:15" count="1,200 Records" status="Processing" statusColor="text-[#FF2D87]" />
              <HistoryRow name="failed_retry_batch_01.csv" date="Oct 21, 2023 • 16:30" count="12 Records" status="Failed" statusColor="text-[#FF3B3B]" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Individual Stat Card - Updated hover & text
const StatCard = ({ label, value, change, icon }) => (
<div className="group bg-white border border-[#C6C6D0] p-4 py-5 rounded-xl hover:border-[#0066FF] transition-all cursor-default">
  <div className="flex justify-between items-start mb-2">
    <span className="text-[9px] font-bold text-[#75757F] uppercase tracking-[0.2em]">
      {label}
    </span>
    <div className="p-1.5 bg-[#F5F5F7] rounded-md group-hover:bg-[#0066FF]/10 text-[#0066FF] group-hover:text-[#0066FF] transition-all">
      {React.cloneElement(icon, { size: 16 })} 
    </div>
  </div>
  
  <div className="flex items-end gap-1.5">
    <h2 className="text-xl font-extrabold text-[#0A0A0F] tracking-tight">
      {value}
    </h2>
    {change && (
      <span className="text-[8px] font-bold text-[#0066FF] bg-[#0066FF]/10 px-1.5 py-0.5 rounded-md mb-1 flex items-center gap-0.5">
        <TrendingUp size={8} /> {change}
      </span>
    )}
  </div>
</div>
);

// Sub-component: Table Row - Consistent Icon Backgrounds
const HistoryRow = ({ name, date, count, status, statusColor }) => (
  <tr className="group hover:bg-[#F9FAFB] transition-colors">
    <td className="px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-[#F5F5F7] rounded-xl text-[#0A0A0F] group-hover:bg-white border border-transparent group-hover:border-[#C6C6D0] transition-all">
          <FileText size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0A0A0F]">{name}</p>
          <p className="text-[11px] text-[#75757F]">{date}</p>
        </div>
      </div>
    </td>
    <td className="px-8 py-5 text-sm font-medium text-[#44444F]">{count}</td>
    <td className="px-8 py-5">
      <div className={`flex items-center gap-2 text-[11px] font-bold ${statusColor}`}>
        <div className={`w-1.5 h-1.5 rounded-full fill-current bg-current`} />
        {status}
      </div>
    </td>
    <td className="px-8 py-5 text-right">
      <button className="p-2 text-[#75757F] hover:text-[#0A0A0F] transition-colors">
        <MoreVertical size={18} />
      </button>
    </td>
  </tr>
);

export default DashboardOverview;