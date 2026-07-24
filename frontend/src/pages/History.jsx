import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { History, Search, FileText, CheckCircle2, Download, RefreshCw, Trash2 } from "lucide-react";

const historyLogs = [
  {
    id: 1,
    title: "Machine Learning Basics.pdf",
    date: "July 24, 2026",
    cards: 24,
    size: "2.4 MB",
    status: "Completed",
  },
  {
    id: 2,
    title: "Data Structures Notes.pdf",
    date: "July 23, 2026",
    cards: 18,
    size: "1.8 MB",
    status: "Completed",
  },
  {
    id: 3,
    title: "Operating Systems.pdf",
    date: "July 22, 2026",
    cards: 30,
    size: "3.1 MB",
    status: "Completed",
  },
  {
    id: 4,
    title: "Computer Networks.pdf",
    date: "July 20, 2026",
    cards: 42,
    size: "4.5 MB",
    status: "Completed",
  },
  {
    id: 5,
    title: "Artificial Intelligence Ethics.pdf",
    date: "July 18, 2026",
    cards: 15,
    size: "1.2 MB",
    status: "Completed",
  },
];

const HistoryPage = () => {
  const [filter, setFilter] = useState("");

  const filteredLogs = historyLogs.filter((log) =>
    log.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Generation History
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Review all your previous PDF conversions and download card decks.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search history logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* History Table Container */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-zinc-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Cards</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                          <FileText size={18} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{item.cards} cards</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.size}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={12} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Export / Download"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          title="Re-generate"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          title="Delete"
                          className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
