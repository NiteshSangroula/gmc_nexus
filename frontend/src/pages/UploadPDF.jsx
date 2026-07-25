import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pdfApi from "../api/pdfApi";
import { toast } from "react-hot-toast";

const UploadPDF = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Preparing document...");

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        toast.error("Please drop a valid PDF document.");
      }
    }
  };

  const startUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setProgress(20);
    setProgressText("Uploading PDF to workspace...");

    // Smoothly simulate upload progress up to 80%
    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 80) return prev + 10;
        return prev;
      });
    }, 150);

    try {
      // 1. Upload PDF
      const uploadRes = await pdfApi.uploadPdf(selectedFile);
      const pdfId = uploadRes.data?.id;

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText("Uploaded successfully!");

      toast.success("PDF uploaded successfully!");

      setTimeout(() => {
        setIsUploading(false);
        navigate("/flashcards", { state: { selectedPdfId: pdfId } }); // Redirect with ID in state!
      }, 600);

    } catch (error) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setProgress(0);
      
      const errMsg = error.response?.data?.message || "Failed to upload PDF. Please check connection.";
      toast.error(errMsg);
      console.error("PDF upload error:", error);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Upload PDF Document
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Upload your lecture notes, textbook chapters, or research papers for instant AI card creation.
          </p>
        </div>

        {/* Upload Container */}
        <div className="glass-panel rounded-3xl p-8 text-center shadow-lg relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>

          {!selectedFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-zinc-900/30 p-12 transition-all hover:border-orange-500/60 hover:bg-orange-500/5 cursor-pointer group"
            >
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="pdf-upload-input"
                onChange={handleFileDrop}
              />
              <label htmlFor="pdf-upload-input" className="cursor-pointer flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-md transition-transform group-hover:scale-110">
                  <UploadCloud size={32} />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Drag and drop your PDF here
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Supports files up to <span className="font-semibold text-slate-700 dark:text-slate-200">25MB</span> (Free Tier)
                </p>

                <div className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20">
                  <span>Browse File</span>
                </div>
              </label>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-zinc-900/80 p-6 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-lg">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                    </p>
                  </div>
                </div>

                {!isUploading && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              {isUploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-orange-500 flex items-center gap-1.5 animate-pulse">
                      <Sparkles size={14} className="animate-spin" /> {progressText}
                    </span>
                    <span className="text-slate-900 dark:text-white">{progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {!isUploading && (
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startUpload}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
                  >
                    <span>Import PDF to Generator</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-center gap-2 text-orange-500">
              <CheckCircle2 size={16} />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Smart Parsing</h4>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Auto extracts key definitions, formulas, and concepts.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-500">
              <Sparkles size={16} />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI Summarization</h4>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Distills multi-page documents into high-retention Q&A cards.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <AlertCircle size={16} />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">OCR Supported</h4>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Reads scanned PDFs and image-heavy slides seamlessly.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadPDF;
