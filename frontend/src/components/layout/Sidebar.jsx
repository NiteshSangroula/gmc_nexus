import { NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Upload,
  Sparkles,
  Library,
  History,
  Crown,
  Coins,
  Settings,
  CircleHelp,
  Gem,
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
    icon: Sparkles,
  },
  {
    title: "Flashcard Library",
    path: "/library",
    icon: Library,
  },
  {
    title: "History",
    path: "/history",
    icon: History,
  },
  {
    title: "Premium",
    path: "/premium",
    icon: Crown,
  },
  {
    title: "Credits",
    path: "/credits",
    icon: Coins,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    path: "/support",
    icon: CircleHelp,
  },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-zinc-900 text-white">

      {/* Logo */}

      <div className="border-b border-slate-800 px-8 py-7">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-violet-600 p-3">
            <BookOpen size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              PDF to Flashcards
            </h1>
          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Premium Card */}

      <div className="m-5 rounded-2xl bg-gradient-to-br from-violet-700 to-purple-600 p-6">

        <div className="flex items-center gap-2">

          <Gem size={22} />

          <h3 className="font-semibold">
            Go Premium
          </h3>

        </div>

        <h2 className="mt-5 text-3xl font-bold leading-tight">
          Unlock Unlimited Learning
        </h2>

        <ul className="mt-6 space-y-3 text-sm text-violet-100">

          <li>✓ Unlimited flashcards</li>

          <li>✓ AI Priority Processing</li>

          <li>✓ Large PDF uploads</li>

          <li>✓ Early access features</li>

        </ul>

        <button
          className="mt-8 w-full rounded-xl bg-white py-3 font-semibold text-violet-700 transition hover:scale-[1.02]"
        >
          Upgrade Now
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;