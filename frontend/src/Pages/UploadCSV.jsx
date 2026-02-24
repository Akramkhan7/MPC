import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (uploadedFile) => {
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      setError(null);
    } else {
      setError('Invalid file type. Please upload a .csv file only.');
      setFile(null);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Drag & Drop Area */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative group border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center bg-white
          ${isDragging ? 'border-[#0066FF] bg-[#F5F5F5] scale-[1.01]' : 'border-[#E0E0E0] hover:border-[#0066FF]'}`}
      >
        <input 
          type="file" 
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        
        <div className={`p-4 rounded-2xl mb-4 transition-colors ${isDragging ? 'bg-[#1A1A1A] text-white' : 'bg-[#F5F5F5] text-[#0066FF]'}`}>
          <UploadCloud size={32} />
        </div>
        
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
          {isDragging ? 'Drop it here!' : 'Drop your CSV file here'}
        </h3>
        <p className="text-sm text-[#A0A0A0] font-medium">
          or click to browse • CSV files only
        </p>
      </div>

      {/* 2. File Preview & Error Handling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-[#0066FF]/20 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle className="text-[#B00020] shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-[#B00020]">Upload Error</p>
              <p className="text-xs text-[#B00020]/80 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Selected File Card */}
        {file && (
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F5F5F5] rounded-xl text-[#0066FF]">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A1A1A] truncate max-w-[180px]">{file.name}</p>
                <p className="text-[10px] text-[#A0A0A0] font-bold uppercase tracking-wider">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-2 text-[#A0A0A0] hover:text-[#B00020] hover:bg-red-50 rounded-full transition-all"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* 3. Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-[#E0E0E0]">
        <button 
          className="text-sm font-bold text-[#666666] hover:text-[#1A1A1A] transition-colors"
          onClick={() => {setFile(null); setError(null);}}
        >
          Cancel
        </button>
        <button 
          disabled={!file}
          className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2
            ${file 
              ? ' border-[#0066FF] bg-[#0066FF] text-white hover:bg-[#0052CC]' 
              : 'bg-[#F5F5F5] text-[#A0A0A0] cursor-not-allowed'}`}
        >
          <CheckCircle2 size={18} />
          Upload & Process
        </button>
      </div>
    </div>
  );
};

export default UploadCSV;