import { Upload, Sparkles, History, Library, Coins, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Upload PDF",
    desc: "Upload a new PDF",
    icon: Upload,
    path: "/upload",
    color: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  {
    title: "Generate Cards",
    desc: "Create flashcards",
    icon: Sparkles,
    path: "/flashcards",
    color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "View History",
    desc: "View all history",
    icon: History,
    path: "/history",
    color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Flashcard Library",
    desc: "View all flashcards",
    icon: Library,
    path: "/library",
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    title: "Credits & Usage",
    desc: "View usage stats",
    icon: Coins,
    path: "/credits",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Go Premium",
    desc: "Upgrade account",
    icon: Crown,
    path: "/premium",
    color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
];

const QuickActions = () => {
  return (
    <div className="human-card rounded-3xl p-6 flex flex-col justify-between h-full">
      <div>
        <div className="border-b border-slate-100 dark:border-white/10 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Common shortcuts and tools</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((act) => {
            const Icon = act.icon;

            return (
              <Link
                key={act.title}
                to={act.path}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-zinc-900/40 p-3.5 transition-all duration-200 hover:border-orange-500/40 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:-translate-y-0.5"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${act.color}`}>
                  <Icon size={17} />
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {act.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
