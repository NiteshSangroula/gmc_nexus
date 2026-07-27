import { useEffect, useState } from "react";
import { Coins, FileText, Folder, Calendar, Clock, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import flashcardApi from "../../api/flashcardApi";

const StatCards = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [flashcardCount, setFlashcardCount] = useState(0);
  const [deckCount, setDeckCount] = useState(0);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await flashcardApi.getFlashcards(0, 1000);
        const cards = response.data?.content || [];
        setFlashcardCount(cards.length);
        
        const uniqueDecks = new Set(cards.map(c => c.deckId));
        setDeckCount(uniqueDecks.size);
      } catch (err) {
        console.error("Failed to fetch stat cards data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Calculate/Retrieve Study Streak from localStorage
    const todayStr = new Date().toISOString().split("T")[0];
    const savedStreak = localStorage.getItem("study-streak-data");
    if (savedStreak) {
      try {
        const data = JSON.parse(savedStreak);
        const lastDate = new Date(data.lastDate);
        const today = new Date(todayStr);
        
        // Calculate difference in days
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Yesterday was the last login, increment streak!
          const newCount = data.count + 1;
          setStreak(newCount);
          localStorage.setItem("study-streak-data", JSON.stringify({ lastDate: todayStr, count: newCount }));
        } else if (diffDays === 0) {
          // Logged in today already, keep same count
          setStreak(data.count);
        } else {
          // Missed days, reset to 1
          setStreak(1);
          localStorage.setItem("study-streak-data", JSON.stringify({ lastDate: todayStr, count: 1 }));
        }
      } catch {
        setStreak(1);
        localStorage.setItem("study-streak-data", JSON.stringify({ lastDate: todayStr, count: 1 }));
      }
    } else {
      setStreak(1);
      localStorage.setItem("study-streak-data", JSON.stringify({ lastDate: todayStr, count: 1 }));
    }

    fetchStats();
  }, []);

  const isPremium = user?.plan === "PREMIUM";
  const creditsLeft = user?.credits !== undefined ? user.credits : 0;

  const stats = [
    {
      id: "credits",
      title: "Daily Conversion Credits",
      value: isPremium ? "Unlimited" : creditsLeft.toString(),
      total: isPremium ? "" : "/ 3",
      subtext: isPremium ? "Premium Account Access" : "Resets daily",
      icon: Coins,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      id: "flashcards",
      title: "Active Flashcards",
      value: loading ? "..." : flashcardCount.toString(),
      subtext: "Total Created Cards",
      icon: FileText,
      iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
    {
      id: "decks",
      title: "Subject Decks",
      value: loading ? "..." : deckCount.toString(),
      subtext: "Organized Collections",
      icon: Folder,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      id: "streak",
      title: "Study Streak",
      value: streak.toString(),
      subtext: "Consecutive Days",
      icon: Calendar,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12131b] p-5 shadow-xs transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.iconBg}`}>
                <Icon size={19} />
              </div>
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
