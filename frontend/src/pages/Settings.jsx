import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { User, Sun, Moon, Save, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [name, setName] = useState(user?.username || "Student");
  const [email, setEmail] = useState(user?.email || "student@gmc.edu");

  useEffect(() => {
    if (user) {
      setName(user.username || user.email?.split("@")[0] || "Student");
      setEmail(user.email || "student@gmc.edu");
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    toast.success("Settings saved successfully!");
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Account Settings & Preferences
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage your personal details, theme preference, and notifications.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Section */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <User size={18} className="text-orange-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Profile Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <Sun size={18} className="text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Appearance & Theme</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                  theme === "dark"
                    ? "border-orange-500 bg-orange-500/10 text-white"
                    : "border-slate-200 dark:border-white/10 text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Moon size={22} className="text-orange-400" />
                <div className="text-left">
                  <h4 className="text-xs font-bold">Obsidian Dark</h4>
                  <p className="text-[10px] text-slate-400">Black & Orange theme</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                  theme === "light"
                    ? "border-orange-500 bg-orange-500/10 text-slate-900"
                    : "border-slate-200 dark:border-white/10 text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Sun size={22} className="text-amber-500" />
                <div className="text-left">
                  <h4 className="text-xs font-bold">Porcelain Light</h4>
                  <p className="text-[10px] text-slate-400">Clean white canvas</p>
                </div>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-xs font-bold text-white shadow-lg hover:scale-105"
            >
              <Save size={16} /> Save Settings
            </button>

            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 animate-in fade-in">
                <CheckCircle size={14} /> Saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
