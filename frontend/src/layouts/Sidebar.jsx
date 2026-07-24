import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  BookOpen,
  History,
  Crown,
  User,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Upload PDF",
    path: "/upload",
    icon: Upload,
  },
  {
    name: "Flashcards",
    path: "/flashcards",
    icon: BookOpen,
  },
  {
    name: "History",
    path: "/history",
    icon: History,
  },
  {
    name: "Premium",
    path: "/premium",
    icon: Crown,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r shadow-sm">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">
          FlashMind
        </h1>

        <p className="text-sm text-gray-500">
          AI Flashcard Generator
        </p>
      </div>

      <nav className="px-3">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 mb-2 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              <Icon size={20} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;