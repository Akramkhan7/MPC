import React from 'react';
import { AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const failureTrendData = [
  { name: 'Mon', errors: 20 },
  { name: 'Tue', errors: 35 },
  { name: 'Wed', errors: 65 },
  { name: 'Thu', errors: 45 },
  { name: 'Fri', errors: 38 },
  { name: 'Sat', errors: 82 },
  { name: 'Sun', errors: 124 },
];

const ErrorLogs = () => {
  const errorLogs = [
    { id: 'REC-88291', time: '2 mins ago', reason: "Invalid email format: 'john.doe@com'", field: 'Email Address' },
    { id: 'REC-88288', time: '15 mins ago', reason: "Missing required field: 'Course Name'", field: 'Course' },
    { id: 'REC-88285', time: '42 mins ago', reason: "Date format mismatch: '2023/13/01'", field: 'Date' },
    { id: 'REC-88282', time: '1 hour ago', reason: "Invalid email format: 'sam_smith#gmai...'", field: 'Email Address' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-['poppins', sans-serif]">
      
      {/* 1. Error Summary Cards: Updated to theme palette */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ErrorStat label="Total Failed" value="124" color="text-[#FF3B3B]" />
        <ErrorStat label="Invalid Emails" value="86" color="text-[#FF2D87]" />
        <ErrorStat label="Missing Data" value="38" color="text-[#75757F]" />
        <ErrorStat label="Resolved" value="412" color="text-[#0066FF]" />
      </div>

      {/* 2. Failure Trends Chart: Vibrant Red Gradient (#FF3B3B) */}
      {/* <div className="bg-white border border-[#C6C6D0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#0A0A0F] mb-6 font-['Poppins'] tracking-tight">Failure Trends (Last 7 Days)</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={failureTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3B3B" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#FF3B3B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#75757F', fontWeight: 700}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(255,59,59,0.15)', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="errors" 
                stroke="#FF3B3B" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorError)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* 3. Record Resolution List: Updated to modern surfaces */}
      <div className="bg-white border border-[#C6C6D0] rounded-2xl p-6 space-y-4 ">
        <h3 className="text-sm font-extrabold text-[#0A0A0F] font-['Poppins', sans-serif]">Recent Error Logs</h3>
        <div className="space-y-3">
          {errorLogs.map((log) => (
            <div key={log.id} className="group flex items-center justify-between p-4 bg-white border border-[#F5F5F7] rounded-2xl hover:border-[#FF3B3B]/30 hover:bg-[#FF3B3B]/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF3B3B]/10 flex items-center justify-center text-[#FF3B3B] ">
                  <AlertCircle size={22} strokeWidth={2.5} />
                </div>
                <div className="grid grid-cols-4 gap-8">
                  <div>
                    <p className="text-xs font-black text-[#0A0A0F] font-['Poppins', sans-serif]">{log.id}</p>
                    <p className="text-[10px] text-[#75757F] font-bold uppercase tracking-tight">{log.time}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] font-black text-[#75757F] uppercase tracking-widest mb-0.5">Reason</p>
                    <p className="text-xs font-bold text-[#FF3B3B] leading-tight">{log.reason}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[#75757F] uppercase tracking-widest mb-0.5">Field</p>
                    <span className="inline-block px-2.5 py-1 bg-[#F5F5F7] rounded-md text-[9px] font-black text-[#44444F] group-hover:bg-white transition-colors">
                      {log.field}
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-2.5 rounded-xl border-2 border-[#0A0A0F] text-[11px] font-black text-[#0A0A0F] uppercase tracking-wider hover:bg-[#0A0A0F] hover:text-white transition-all  active:scale-95">
                Fix Record
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ErrorStat = ({ label, value, color }) => (
  <div className="bg-white border border-[#C6C6D0] p-6 rounded-2xl shadow-sm">
    <p className="text-[10px] font-black text-[#75757F] uppercase tracking-[0.2em] mb-1">{label}</p>
    <h2 className={`text-2xl font-black font-['Poppins', sans-serif] ${color}`}>{value}</h2>
  </div>
);

export default ErrorLogs;