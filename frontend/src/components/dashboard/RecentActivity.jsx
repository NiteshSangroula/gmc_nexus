import { useState, useEffect } from "react";
import { FileText, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import flashcardApi from "../../api/flashcardApi";

const SkeletonActivity = () => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-900/30 p-3.5 animate-pulse">
    <div className="flex items-center gap-3 w-2/3">
      <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-zinc-800" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-2.5 w-1/3 rounded bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
    <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-zinc-800" />
  </div>
);

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setIsLoading(true);
        const response = await flashcardApi.getFlashcards(0, 200);
        const cards = response.data?.content || [];
        
        // Group by deckId and sort by newest createdAt
        const decksMap = {};
        cards.forEach((card) => {
          if (!decksMap[card.deckId]) {
            decksMap[card.deckId] = {
              id: card.deckId,
              fileName: card.deckTitle || "Untitled Deck",
              cardsCount: 0,
              createdAt: card.createdAt,
            };
          }
          decksMap[card.deckId].cardsCount += 1;
          // Keep the newest createdAt
          if (new Date(card.createdAt) > new Date(decksMap[card.deckId].createdAt)) {
            decksMap[card.deckId].createdAt = card.createdAt;
          }
        });

        // Convert map to array and sort by createdAt descending
        const sortedDecks = Object.values(decksMap).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Take the top 3 latest activities
        setActivities(sortedDecks.slice(0, 3));
      } catch (error) {
        console.error("Failed to load recent activities for dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recent";
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="human-card rounded-3xl p-6">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest flashcard generations</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {isLoading ? (
            <>
              <SkeletonActivity />
              <SkeletonActivity />
              <SkeletonActivity />
            </>
          ) : activities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No recent activity. Generate your first flashcard deck!
            </div>
          ) : (
            activities.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-zinc-900/40 p-3.5 transition-all hover:border-orange-500/40 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    <FileText size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={item.fileName}>
                      {item.fileName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Generated {item.cardsCount} cards • {formatTimeAgo(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-2 shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={11} />
                    Ready
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
