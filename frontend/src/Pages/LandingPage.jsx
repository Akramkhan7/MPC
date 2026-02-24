import React from 'react';
import { 
  ShieldCheck, Sparkles, ArrowRight, CheckCircle2, PieChart, Database, Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  // Initialize navigate hook
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-['Inter',sans-serif] text-[#1A1A1A]">
      {/* Nav */}
      <nav className="border-b border-[#E0E0E0] sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Branding */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-6 h-6 bg-[#1A1A1A] rounded-md flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tighter">CertiFlow</span>
          </div>

          {/* Fixed: Redirects to lowercase /dashboard or /login as per App.jsx logic */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-sm font-semibold border border-[#E0E0E0] px-6 py-2.5 rounded-full hover:bg-[#F5F5F5] transition-all"
          >
            Admin Portal
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F5] border border-[#E0E0E0] text-[10px] font-bold uppercase tracking-widest text-[#666666] mb-10">
            <Sparkles className="w-3 h-3 text-[#7C9CB4]" /> Milestone Performance Check (MPC)
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9] text-[#1A1A1A]">
            Issue Certificates <br /> 
            <span className="text-[#7C9CB4]">At Enterprise Scale.</span>
          </h1>
          <p className="text-xl text-[#666666] mb-12 font-light leading-relaxed max-w-3xl mx-auto">
            Designed for KVON Tech Consultancy. A high-performance Node.js & Database architecture to automate the entire credential lifecycle—from CSV ingestion to verifiable PDF delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            {/* Fixed: Replaced setView with navigate */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-medium hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
            >
              Access Dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white text-[#1A1A1A] border border-[#E0E0E0] px-10 py-4 rounded-full font-medium hover:bg-[#F5F5F5] transition-all">
              View Documentation
            </button>
          </div>

          {/* Visual Dashboard Placeholder */}
          <div className="relative mx-auto max-w-5xl group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7C9CB4] to-[#1A1A1A] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white border border-[#E0E0E0] rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-[#F5F5F5] border-b border-[#E0E0E0] p-3 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF605C]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD44]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#00CA4E]"></div>
              </div>
              <div className="p-2 bg-[#FFFFFF]">
                <div className="grid grid-cols-12 gap-4 p-4">
                  <div className="col-span-4 space-y-4">
                    <div className="h-32 bg-[#F5F5F5] rounded-xl animate-pulse p-4">
                      <div className="w-1/2 h-3 bg-[#E0E0E0] rounded mb-4"></div>
                      <div className="w-full h-8 bg-[#1A1A1A]/5 rounded"></div>
                    </div>
                    <div className="h-48 bg-[#1A1A1A] rounded-xl p-6 text-white text-left">
                      <PieChart className="w-8 h-8 mb-4 text-[#7C9CB4]" />
                      <p className="text-xs uppercase tracking-widest font-bold opacity-50 mb-1">Total Dispatched</p>
                      <p className="text-3xl font-bold">12,840</p>
                    </div>
                  </div>
                  <div className="col-span-8 bg-[#F5F5F5] rounded-xl p-6 relative">
                    <div className="flex justify-between items-center mb-8">
                      <div className="w-32 h-4 bg-[#E0E0E0] rounded"></div>
                      <div className="w-16 h-4 bg-[#E0E0E0] rounded"></div>
                    </div>
                    <div className="flex items-end gap-2 h-40">
                      {[60, 40, 90, 70, 50, 85, 30, 95, 45, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#1A1A1A] rounded-t-md opacity-20" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-[#A0A0A0] uppercase tracking-[0.2em] text-center">Generation Analytics Peak: 48 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Deep-Dive Grid */}
        <section id="features" className="bg-[#F5F5F5] py-32 border-y border-[#E0E0E0]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Detailed Functional Requirements</h2>
              <p className="text-[#666666] font-light max-w-xl">A complete breakdown of the Milestone Performance Check application features.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-2xl border border-[#E0E0E0] hover:border-[#1A1A1A] transition-colors group">
                <div className="bg-[#F5F5F5] group-hover:bg-[#1A1A1A] transition-colors p-4 w-fit rounded-xl mb-8">
                  <Database className="text-[#1A1A1A] group-hover:text-white w-6 h-6 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4">01. CSV Engine</h3>
                <ul className="text-sm text-[#666666] space-y-3 font-light">
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Admin bulk upload capability</li>
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Fields: Name, Date, Grade, Email</li>
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Automated file format validation</li>
                </ul>
              </div>

              <div className="bg-white p-10 rounded-2xl border border-[#E0E0E0] hover:border-[#1A1A1A] transition-colors group">
                <div className="bg-[#F5F5F5] group-hover:bg-[#1A1A1A] transition-colors p-4 w-fit rounded-xl mb-8">
                  <Sparkles className="text-[#1A1A1A] group-hover:text-white w-6 h-6 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4">02. Smart PDF Gen</h3>
                <ul className="text-sm text-[#666666] space-y-3 font-light">
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Predefined PDF/Image templates</li>
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Verifiable QR Code integration</li>
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Instant data mapping into template</li>
                </ul>
              </div>

              <div className="bg-white p-10 rounded-2xl border border-[#E0E0E0] hover:border-[#1A1A1A] transition-colors group">
                <div className="bg-[#F5F5F5] group-hover:bg-[#1A1A1A] transition-colors p-4 w-fit rounded-xl mb-8">
                  <Send className="text-[#1A1A1A] group-hover:text-white w-6 h-6 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4">03. Automated Dispatch</h3>
                <ul className="text-sm text-[#666666] space-y-3 font-light">
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Custom subject lines & body</li>
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Automatic PDF email attachments</li>
                  <li className="flex gap-2"> <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0"/> Real-time delivery tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="bg-[#1A1A1A] rounded-3xl p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C9CB4] blur-[120px] opacity-20"></div>
              <ShieldCheck className="w-12 h-12 text-[#7C9CB4] mb-6" />
              <h2 className="text-3xl font-bold mb-6 tracking-tight">System Integrity & <br />Security</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-[#7C9CB4] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400 font-light">Admin Login Authentication to prevent unauthorized access.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-[#7C9CB4] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400 font-light">Error handling for invalid email addresses or missing CSV fields.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-[#7C9CB4] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400 font-light">Robust CSV data validation before generation starts.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A0A0A0] mb-4">Admin Hub</h3>
              <h2 className="text-4xl font-bold mb-6 tracking-tight text-[#1A1A1A]">Manage everything in <br /> one central portal.</h2>
              <p className="text-[#666666] font-light leading-relaxed mb-8">
                The Admin Dashboard provides full visibility into the system's performance. Track upload history, generation status, and error logs for failed records in real-time.
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 font-bold text-sm border-b-2 border-[#1A1A1A] pb-1 hover:gap-4 transition-all"
              >
                Explore Dashboard Features <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-50 text-[11px] font-bold tracking-widest uppercase">
          <p>© 2026 Certiflow Systems Inc.</p>
          <p>KVON Tech Consultancy Services Private Limited</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;