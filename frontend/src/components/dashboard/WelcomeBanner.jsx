import { Upload, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const WelcomeBanner = () => {
  const { user } = useAuth();
  const name = user?.username || user?.email?.split("@")[0] || "Student";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-[#12131b] p-6 sm:p-8 text-white shadow-md border border-slate-800 dark:border-white/10">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 dark:bg-white/10 px-3.5 py-1 text-xs font-semibold text-orange-400 mb-3 border border-slate-700 dark:border-white/10">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
            <span>Study Workspace</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {name}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Convert your lecture notes, textbook chapters, and slides into active recall study decks for faster revision.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/upload"
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-500 transition-all"
            >
              <Upload size={16} />
              Upload PDF Notes
            </Link>

            <Link
              to="/library"
              className="flex items-center gap-2 rounded-xl border border-slate-700 dark:border-white/20 bg-slate-800/80 dark:bg-white/5 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all"
            >
              <Layers size={16} />
              Browse Study Decks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;