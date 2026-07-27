import { useState, useEffect } from "react";
import { Layers, Globe, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import flashcardApi from "../../api/flashcardApi";

const SkeletonDeck = () => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-900/30 p-4 animate-pulse">
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

const PublicDecks = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicDecks = async () => {
      try {
        setIsLoading(true);
        const response = await flashcardApi.getPublicFlashcards(0, 200);
        const cards = response.data?.content || [];
        
        const decksMap = {};
        cards.forEach((card) => {
          if (!card.deckId) return;
          if (!decksMap[card.deckId]) {
            decksMap[card.deckId] = {
              id: card.deckId,
              title: card.deckTitle || "Untitled Deck",
              cardsCount: 0,
            };
          }
          decksMap[card.deckId].cardsCount += 1;
        });

        // Take top 3 public decks
        setDecks(Object.values(decksMap).slice(0, 3));
      } catch (error) {
        console.error("Failed to load public decks for dashboard:", error);
      } finally {
        // Artificially delay a tiny bit for skeleton demo feel if it loads instantly
        setTimeout(() => setIsLoading(false), 600);
      }
    };

    fetchPublicDecks();
  }, []);

  return (
    <div className="human-card rounded-3xl p-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Globe size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Campus Public Library</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Popular study decks from campus peers</p>
          </div>
        </div>
        <Link
          to="/public-library"
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 group"
        >
          Explore All <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <>
            <SkeletonDeck />
            <SkeletonDeck />
            <SkeletonDeck />
          </>
        ) : decks.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No public decks uploaded yet. Be the first to share one!
          </div>
        ) : (
          decks.map((deck) => (
            <div
              key={deck.id}
              onClick={() => navigate("/public-library")}
              className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-zinc-900/40 p-4 transition-all hover:border-orange-500/40 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Layers size={19} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-45" title={deck.title}>
                    {deck.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Public Deck • {deck.cardsCount} cards
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                Study Deck
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicDecks;
