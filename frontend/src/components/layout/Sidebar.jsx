import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FileText,
  LayoutDashboard,
  Upload,
  Layers,
  FolderOpen,
  History,
  Award,
  Coins,
  Settings,
  HelpCircle,
  ArrowUpRight,
  X,
  Globe,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload PDF",
    path: "/upload",
    icon: Upload,
  },
  {
    title: "Generate Flashcards",
    path: "/flashcards",
    icon: Layers,
  },
  {
    title: "Flashcard Library",
    path: "/library",
    icon: FolderOpen,
  },
  {
    title: "Public Flashcards",
    path: "/public-library",
    icon: Globe,
  },
  {
    title: "History",
    path: "/history",
    icon: History,
  },
  {
    title: "Pro Plan",
    path: "/premium",
    icon: Award,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    path: "/support",
    icon: HelpCircle,
  },
];

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { user } = useAuth();
  const plan = user?.plan || "PRO";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c10] text-slate-900 dark:text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 dark:border-white/10 px-6">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                PDF to Flashcards
              </h1>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Personal Study Workspace
              </span>
            </div>
          </NavLink>

          {/* Close button for mobile */}
          <button
            onClick={closeMobileSidebar}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? "bg-orange-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        <div className="p-4">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {plan} Account
              </span>
              <span className="rounded bg-orange-100 dark:bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:text-orange-400">
                Active Plan
              </span>
            </div>

            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Unlimited document uploads & custom flashcard export.
            </p>

            <NavLink
              to="/premium"
              onClick={closeMobileSidebar}
              className="mt-3 flex items-center justify-center gap-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 text-xs font-bold text-slate-800 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <span>Manage Subscription</span>
              <ArrowUpRight size={14} />
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;