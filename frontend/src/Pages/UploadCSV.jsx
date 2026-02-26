import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;

  // Safe file validation
  const handleFile = (uploadedFile) => {
    if (
      uploadedFile &&
      uploadedFile.name.toLowerCase().endsWith(".csv")
    ) {
      setFile(uploadedFile);
      setError(null);
      setResult(null);
    } else {
      setError("Invalid file type. Please upload a .csv file only.");
      setFile(null);
    }
  };

  // Upload API
  const handleUpload = async () => {
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login again. Token missing.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${baseURL}/batches/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        setResult(response.data.data);
        setError(null);
      } else {
        setError("Upload failed");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Upload failed"
      );
      setResult(null);
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Drag & Drop */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center bg-white
          ${isDragging ? "border-[#0066FF] bg-[#F5F5F5]" : "border-[#E0E0E0]"}`}
      >
        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <UploadCloud size={32} className="mb-3 text-[#0066FF]" />
        <h3 className="font-bold">
          {isDragging ? "Drop it here!" : "Drop your CSV file here"}
        </h3>
        <p className="text-sm text-gray-400">or click to browse</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border rounded-xl p-4 flex items-center gap-2 text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="bg-white border rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-[#0066FF]" />
            <div>
              <p className="font-bold">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button onClick={() => setFile(null)}>
            <X size={18} />
          </button>
        </div>
      )}

<<<<<<< HEAD
        {/* Selected File Card */}
        {file && (
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F5F5F5] rounded-xl text-[#0066FF]">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A1A1A] truncate max-w-[180px]">
                  {file.name}
                </p>
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
          onClick={() => {
            setFile(null);
            setError(null);
          }}
        >
          Cancel
        </button>
        <button
          disabled={!file}
          className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2
            ${
              file
                ? " border-[#0066FF] bg-[#0066FF] text-white hover:bg-[#0052CC]"
                : "bg-[#F5F5F5] text-[#A0A0A0] cursor-not-allowed"
=======
      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2
            ${
              file && !loading
                ? "bg-[#0066FF] text-white hover:bg-[#0052CC]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
>>>>>>> 5e08767 (Finished)
            }`}
        >
          <CheckCircle2 size={18} />
          {loading ? "Processing..." : "Upload & Process"}
        </button>
      </div>

      {/* Result Preview */}
      {result && (
        <div className="bg-white border rounded-2xl p-6 mt-6">
          <h3 className="font-bold text-lg mb-4">Batch Summary</h3>

          <div className="mb-4">
            <p>Total: {result?.stats?.total ?? 0}</p>
            <p className="text-green-600">
              Valid: {result?.stats?.valid ?? 0}
            </p>
            <p className="text-red-600">
              Invalid: {result?.stats?.invalid ?? 0}
            </p>
          </div>

          {result?.preview?.length > 0 && (
            <div className="overflow-auto max-h-64">
              <table className="w-full text-sm border">
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
                  {result.preview.map((row, index) => (
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadCSV;
