import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Library, Search, Layers, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, X, Trash2 } from "lucide-react";
import flashcardApi from "../api/flashcardApi";
import { toast } from "react-hot-toast";

const LibraryPage = () => {
  const [decks, setDecks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDecks = async () => {
    try {
      setIsLoading(true);
      const response = await flashcardApi.getFlashcards(0, 500);
      const cards = response.data?.content || [];
      
      const decksMap = {};
      cards.forEach((card) => {
        if (!decksMap[card.deckId]) {
          const isAi = card.deckTitle?.toLowerCase().endsWith(".pdf");
          decksMap[card.deckId] = {
            id: card.deckId,
            title: card.deckTitle || "Untitled Deck",
            category: isAi ? "AI Generated" : "Custom Deck",
            cards: [],
          };
        }
        decksMap[card.deckId].cards.push({
          id: card.id,
          q: card.question,
          a: card.answer,
        });
      });
      
      setDecks(Object.values(decksMap));
    } catch (error) {
      toast.error("Failed to load your flashcard library.");
      console.error("Personal Library fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDecks();
  }, []);

  const filteredDecks = decks.filter((deck) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = deck.title?.toLowerCase().includes(query) || false;
    const catMatch = deck.category?.toLowerCase().includes(query) || false;
    const cardsMatch = deck.cards?.some(
      (card) =>
        card.q?.toLowerCase().includes(query) ||
        card.a?.toLowerCase().includes(query)
    ) || false;
    return titleMatch || catMatch || cardsMatch;
  });

  const openDeckModal = (deck) => {
    setSelectedDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (!selectedDeck || !selectedDeck.cards || !selectedDeck.cards.length) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % selectedDeck.cards.length);
  };

  const handlePrevCard = () => {
    if (!selectedDeck || !selectedDeck.cards || !selectedDeck.cards.length) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + selectedDeck.cards.length) % selectedDeck.cards.length);
  };

  const handleDeleteDeck = async (deckId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this deck? This action cannot be undone.")) {
      return;
    }
    try {
      await flashcardApi.deleteDeck(deckId);
      toast.success("Deck deleted successfully.");
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
      if (selectedDeck && selectedDeck.id === deckId) {
        setSelectedDeck(null);
      }
    } catch (error) {
      toast.error("Failed to delete deck.");
      console.error("Delete deck error:", error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              My Flashcard Library
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Browse, study, and manage all your generated active recall flashcards.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search your decks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-12 text-center">
            <Library size={48} className="mx-auto text-slate-300 dark:text-zinc-700" />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No decks found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Generate a deck from a PDF note or create a custom card to get started!
            </p>
          </div>
        ) : (
          /* Deck Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => openDeckModal(deck)}
                className="group glass-panel glass-panel-hover flex flex-col justify-between rounded-3xl p-6 cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                    {deck.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <Layers size={14} className="text-amber-500" />
                    <span>{deck.cards.length} Cards</span>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {deck.title}
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                  <span className="text-xs font-bold text-orange-500 group-hover:underline">
                    Study Deck →
                  </span>
                  <button
                    onClick={(e) => handleDeleteDeck(deck.id, e)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors"
                    title="Delete Deck"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3D Interactive Flip Card Modal */}
        {selectedDeck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121218] p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedDeck.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Card {currentCardIndex + 1} of {selectedDeck.cards.length}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDeck(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 3D Flip Card Container */}
              <div className="my-8 perspective-1000">
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`relative min-h-[260px] w-full cursor-pointer rounded-3xl p-8 border border-orange-500/30 shadow-2xl transition-transform duration-500 transform-style-3d ${
                    isFlipped ? "rotate-y-180 bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white" : "bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white"
                  }`}
                >
                  {/* Front Side */}
                  <div className={`flex flex-col justify-between h-full space-y-6 ${isFlipped ? "hidden" : "block"}`}>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-orange-500/20 px-3 py-1 text-[10px] font-extrabold uppercase text-orange-400 tracking-wider">
                        Question Side
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <RotateCw size={12} /> Click to flip
                      </span>
                    </div>

                    <div className="my-auto text-center">
                      <p className="text-lg font-bold sm:text-xl text-white leading-relaxed">
                        {selectedDeck.cards[currentCardIndex]?.q}
                      </p>
                    </div>

                    <div className="text-center text-[11px] text-slate-400">
                      Tap card anywhere to reveal answer
                    </div>
                  </div>

                  {/* Back Side (Flipped) */}
                  <div className={`flex flex-col justify-between h-full space-y-6 rotate-y-180 ${isFlipped ? "block" : "hidden"}`}>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase text-white tracking-wider">
                        Answer Side
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-amber-200">
                        <RotateCw size={12} /> Flipped
                      </span>
                    </div>

                    <div className="my-auto text-center">
                      <p className="text-base font-semibold sm:text-lg text-white leading-relaxed">
                        {selectedDeck.cards[currentCardIndex]?.a}
                      </p>
                    </div>

                    <div className="flex justify-center gap-4 pt-2">
                      <span className="flex items-center gap-1 rounded-xl bg-emerald-500/30 border border-emerald-400/40 px-4 py-1.5 text-xs font-bold text-emerald-100">
                        <CheckCircle2 size={14} /> Tap to flip back
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                <button
                  onClick={handlePrevCard}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/30 px-4 py-2 text-xs font-bold text-orange-500 hover:bg-orange-500/20"
                >
                  <RotateCw size={14} /> Flip Card
                </button>

                <button
                  onClick={handleNextCard}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:scale-105"
                >
                  <span>Next Card</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LibraryPage;
