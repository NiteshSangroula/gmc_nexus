import { Coins, FileText, Folder, Calendar, Clock } from "lucide-react";

const stats = [
  {
    id: "credits",
    title: "Daily Conversion Credits",
    value: "23",
    total: "/ 50",
    footer: "Resets in 10h 24m",
    icon: Coins,
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    badge: Clock,
  },
  {
    id: "flashcards",
    title: "Active Flashcards",
    value: "532",
    subtext: "Total Created Cards",
    icon: FileText,
    iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  {
    id: "decks",
    title: "Subject Decks",
    value: "12",
    subtext: "Organized Folders",
    icon: Folder,
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: "streak",
    title: "Study Streak",
    value: "7",
    subtext: "Consecutive Days",
    icon: Calendar,
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
];

const StatCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const BadgeIcon = stat.badge;

        return (
          <div
            key={stat.id}
            className="human-card human-card-hover relative overflow-hidden rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.iconBg}`}>
                <Icon size={19} />
              </div>
              {stat.footer && (
                <div className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-zinc-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                  {BadgeIcon && <BadgeIcon size={12} className="text-amber-500" />}
                  <span>{stat.footer}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                {stat.total && (
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
                    {stat.total}
                  </span>
                )}
              </div>
              {stat.subtext && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {stat.subtext}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
