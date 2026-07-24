import { FileText, MoreVertical, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const activityData = [
  {
    id: 1,
    fileName: "Machine Learning Basics.pdf",
    cardsCount: 24,
    timeAgo: "2h ago",
    status: "Completed",
  },
  {
    id: 2,
    fileName: "Data Structures Notes.pdf",
    cardsCount: 18,
    timeAgo: "1d ago",
    status: "Completed",
  },
  {
    id: 3,
    fileName: "Operating Systems.pdf",
    cardsCount: 30,
    timeAgo: "2d ago",
    status: "Completed",
  },
];

const RecentActivity = () => {
  return (
    <div className="human-card rounded-3xl p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest flashcard generations</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {activityData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-zinc-900/40 p-3.5 transition-all hover:border-orange-500/40 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <FileText size={19} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.fileName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Generated {item.cardsCount} cards • {item.timeAgo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 size={12} />
                  {item.status}
                </span>

                <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
