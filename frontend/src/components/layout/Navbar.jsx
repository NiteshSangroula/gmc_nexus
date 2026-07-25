import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, Menu, X, Sparkles, User, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = ({ toggleMobileSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Flashcard Deck Created",
      desc: "Machine Learning Basics deck with 24 cards is ready to study.",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "7-Day Study Streak!",
      desc: "Great job! You completed all daily review sessions this week.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 3,
      title: "PDF File Processed",
      desc: "Data Structures Notes parsed successfully.",
      time: "Yesterday",
      unread: false,
    },
  ];

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const usernameDisplay = user?.username || user?.email?.split("@")[0] || "Student";
  const userEmailDisplay = user?.email || "student@gmc.edu";
  const userPlan = user?.plan || "PRO";
  
  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0b0c10]/90 px-6 backdrop-blur-md transition-colors duration-200 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="rounded-xl p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Student Learning Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 transition-all hover:border-orange-500/50 hover:bg-slate-200/80 dark:hover:bg-zinc-800 shadow-xs"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-xs">
              2
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13141c] p-4 shadow-xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h3>
                  <span className="rounded-full bg-orange-100 dark:bg-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:text-orange-400">
                    2 New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
                      notif.unread
                        ? "bg-orange-50/70 dark:bg-orange-500/10 border border-orange-200/80 dark:border-orange-500/20"
                        : "hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="mt-0.5 rounded-lg bg-orange-500/20 p-1.5 text-orange-600 dark:text-orange-400">
                      <Sparkles size={15} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{notif.desc}</p>
                      <span className="mt-1 block text-[10px] text-slate-400 dark:text-slate-500">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 p-1.5 pr-3 transition-all hover:border-orange-500/50 shadow-xs"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-xs font-extrabold text-white shadow-xs">
              {getInitials(usernameDisplay)}
            </div>
            <div className="hidden text-left sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-28">{usernameDisplay}</span>
                <span className="rounded bg-orange-600 text-[9px] font-extrabold uppercase text-white px-1.5 py-0.2">
                  {userPlan}
                </span>
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13141c] p-2 shadow-xl backdrop-blur-xl z-50">
              <div className="border-b border-slate-100 dark:border-white/10 px-3 py-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{usernameDisplay}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userEmailDisplay}</p>
              </div>
              <div className="mt-1 space-y-0.5">
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <User size={15} />
                  Profile Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
