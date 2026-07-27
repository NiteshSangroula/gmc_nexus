import { useState, useEffect } from "react";
import { FileText, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import pdfApi from "../../api/pdfApi";

const SkeletonUpload = () => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-900/30 p-3.5 animate-pulse">
    <div className="flex items-center gap-3 w-2/3">
      <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-zinc-800" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-2.5 w-1/3 rounded bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
    <div className="h-5 w-5 rounded bg-slate-200 dark:bg-zinc-800" />
  </div>
);

const RecentUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUploads = async () => {
      try {
        setIsLoading(true);
        const response = await pdfApi.getAllPdfs();
        const pdfList = response.data || [];
        
        // Sort by uploadedAt descending
        const sortedPdfs = pdfList.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );

        // Take the top 3 latest uploads
        setUploads(sortedPdfs.slice(0, 3));
      } catch (error) {
        console.error("Failed to load recent uploads for dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentUploads();
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recent";
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="human-card rounded-3xl p-6">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Uploads</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">PDF documents on workspace</p>
          </div>
          <Link
            to="/upload"
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {isLoading ? (
            <>
              <SkeletonUpload />
              <SkeletonUpload />
              <SkeletonUpload />
            </>
          ) : uploads.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No uploaded PDFs. Upload your first PDF to generate flashcards!
            </div>
          ) : (
            uploads.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-zinc-900/40 p-3.5 transition-all hover:border-orange-500/40 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <FileText size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={file.filename}>
                      {file.filename}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Uploaded {formatTimeAgo(file.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center ml-2 shrink-0">
                  <button
                    title="Options"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white"
                  >
                    <MoreVertical size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentUploads;
