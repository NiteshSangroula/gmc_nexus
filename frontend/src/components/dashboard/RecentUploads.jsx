import { FileText, MoreVertical, Download } from "lucide-react";
import { Link } from "react-router-dom";

const uploads = [
  {
    id: 1,
    fileName: "Deep Learning Guide.pdf",
    timeAgo: "2h ago",
    size: "2.4 MB",
  },
  {
    id: 2,
    fileName: "Database Systems.pdf",
    timeAgo: "1d ago",
    size: "1.8 MB",
  },
  {
    id: 3,
    fileName: "Computer Networks.pdf",
    timeAgo: "2d ago",
    size: "3.1 MB",
  },
];

const RecentUploads = () => {
  return (
    <div className="human-card rounded-3xl p-6 flex flex-col justify-between">
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
          {uploads.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-zinc-900/40 p-3.5 transition-all hover:border-orange-500/40 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <FileText size={19} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {file.fileName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {file.timeAgo} • {file.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  title="Download File"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white"
                >
                  <Download size={15} />
                </button>
                <button
                  title="Options"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white"
                >
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentUploads;
