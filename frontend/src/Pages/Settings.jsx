import React, { useState } from 'react';
import { Upload, Mail, Save, Info, Plus } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('certificate');
  
  // State for Email Editor
  const [emailSubject, setEmailSubject] = useState('Your Certificate from CertifyPro');
  const [emailBody, setEmailBody] = useState(
    `Dear {{name}},\n\nCongratulations on completing {{course}}!\n\nYour grade: {{grade}}\nCertificate ID: {{certId}}\n\nPlease find your certificate attached.\n\nBest regards,\nCertifyPro Team`
  );

  const tabs = [
    { id: 'certificate', label: 'Certificate Template' },
    { id: 'email', label: 'Email Template' }
  ];

  return (
    <div className="max-w-6xl mx-auto py-3 px-6 animate-in fade-in duration-700">
      
      {/* 1. Navigation: Vibrant Primary Blue (#0066FF) */}
      <nav className="flex gap-8 border-b border-[#C6C6D0] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-5 text-[11px] font-bold tracking-tight transition-all relative ${
              activeTab === tab.id ? 'text-[#0066FF]' : 'text-[#75757F] hover:text-[#0066FF]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#0066FF] rounded-full shadow-[0_2px_10px_rgba(0,102,255,0.3)]" />
            )}
          </button>
        ))}
      </nav>

      {/* 2. Content: Certificate Template */}
      {activeTab === 'certificate' && (
        <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-[#0A0A0F]">Certificate Background</h2>
            <p className="text-[11px] text-[#75757F] font-medium leading-relaxed">
              Upload the high-resolution image used as the base for all generated certificates.
            </p>
          </div>

          <div className="group relative border-2 border-dashed border-[#C6C6D0] hover:border-[#0066FF] rounded-3xl p-20 flex flex-col items-center justify-center bg-white transition-all cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-[#D6E4FF] flex items-center justify-center text-[#0066FF] group-hover:scale-110 transition-transform mb-4">
              <Upload size={22} strokeWidth={2} />
            </div>
            <p className="text-[11px] font-bold text-[#0A0A0F]">Select image or drag here</p>
            <p className="text-[9px] text-[#75757F] font-bold mt-2 uppercase tracking-[0.1em]">PNG • JPG • MAX 5MB</p>
          </div>

          <div className="flex justify-end pt-4">
            <button className="text-[11px] font-bold text-white bg-[#0066FF] px-12 py-3.5 rounded-2xl hover:bg-[#001A4D] transition-all shadow-md active:scale-95">
              Update Asset
            </button>
          </div>
        </div>
      )}

      {/* 3. Content: Email Template Editor */}
      {activeTab === 'email' && (
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-500">
          <div className="space-y-6">
            {/* Subject: Focused Blue Line */}
            <div className="group space-y-2">
              <label className="text-[10px] font-bold text-[#75757F] uppercase tracking-widest transition-colors group-focus-within:text-[#0066FF]">
                Subject Line
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-transparent border-b border-[#C6C6D0] py-2 text-sm text-[#0A0A0F] focus:border-[#0066FF] outline-none transition-all font-semibold"
                placeholder="Enter subject..."
              />
            </div>

            {/* Body: Ghost Textarea with Primary Accents */}
            <div className="group space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-[#75757F] uppercase tracking-widest transition-colors group-focus-within:text-[#0066FF]">
                  Email Body
                </label>
                <div className="flex gap-2">
                  {['name', 'course', 'grade'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setEmailBody(emailBody + ` {{${tag}}}`)}
                      className="text-[9px] font-bold text-[#0066FF] bg-[#D6E4FF] border border-transparent px-2 py-1 rounded-md hover:bg-[#0066FF] hover:text-white transition-all"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={12}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full p-6 bg-[#F5F5F7] border border-transparent rounded-2xl text-xs leading-relaxed text-[#0A0A0F] focus:bg-white focus:border-[#D6E4FF] focus:ring-1 focus:ring-[#D6E4FF] outline-none transition-all font-medium min-h-[320px] resize-none shadow-sm"
              />
            </div>
          </div>

          {/* 4. Actions */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-2 text-[#75757F]">
              <Info size={12} className="text-[#0066FF]" />
              <span className="text-[10px] font-medium tracking-tight">Variables are case-sensitive.</span>
            </div>
            
            <button className="flex items-center gap-2 text-[11px] font-bold text-white bg-[#0066FF] px-10 py-3.5 rounded-2xl hover:bg-[#001A4D] hover:shadow-lg transition-all shadow-md active:scale-95">
              <Save size={14} />
              Save Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;