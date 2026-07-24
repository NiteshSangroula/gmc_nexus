import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Library, Search, Layers, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, X, Sparkles } from "lucide-react";

const initialDecks = [
  {
    id: 1,
    title: "Machine Learning Basics",
    cardsCount: 24,
    category: "AI & ML",
    mastery: 85,
    cards: [
      { q: "What is Supervised Learning?", a: "Training a model using input data along with correct target labels." },
      { q: "Define Overfitting in Machine Learning.", a: "When a model learns details/noise in training data to the extent that it negatively impacts performance on new data." },
      { q: "What is the function of Gradient Descent?", a: "An optimization algorithm for finding a local minimum of a differentiable function." },
      { q: "Explain Precision vs Recall.", a: "Precision is true positives divided by total predicted positives; Recall is true positives divided by total actual positives." },
    ],
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    cardsCount: 18,
    category: "Computer Science",
    mastery: 92,
    cards: [
      { q: "What is the worst-case time complexity of QuickSort?", a: "O(n²), which occurs when the pivot chosen is consistently the smallest or largest element." },
      { q: "Difference between Stack and Queue?", a: "Stack is LIFO (Last In First Out); Queue is FIFO (First In First Out)." },
      { q: "What is a Hash Collision?", a: "When two distinct keys produce the same hash index in a hash table." },
    ],
  },
  {
    id: 3,
    title: "Operating Systems Core Concepts",
    cardsCount: 30,
    category: "Systems",
    mastery: 70,
    cards: [
      { q: "What is a Deadlock in OS?", a: "A situation where a set of processes are blocked because each process holds a resource and waits for another." },
      { q: "Difference between Process and Thread?", a: "A process is an executing program with its own memory space; a thread is a lightweight segment within a process." },
    ],
  },
  {
    id: 4,
    title: "Deep Learning Foundations",
    cardsCount: 35,
    category: "AI & ML",
    mastery: 60,
    cards: [
      { q: "What is Backpropagation?", a: "An algorithm for computing gradients of the loss function with respect to weights using the chain rule." },
      { q: "What is a Convolutional Layer?", a: "A neural network layer that applies spatial filters to extract features from 2D grids such as images." },
    ],
  },
];

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredDecks = initialDecks.filter((deck) =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDeckModal = (deck) => {
    setSelectedDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (!selectedDeck) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % selectedDeck.cards.length);
  };

  const handlePrevCard = () => {
    if (!selectedDeck) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + selectedDeck.cards.length) % selectedDeck.cards.length);
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Flashcard Library
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Browse, study, and test your retention across all your AI-generated decks.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search decks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDecks.map((deck) => (
            <div
              key={deck.id}
              onClick={() => openDeckModal(deck)}
              className="group glass-panel glass-panel-hover flex flex-col justify-between rounded-3xl p-6 cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[11px] font-bold text-orange-500">
                  {deck.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <Layers size={14} className="text-amber-500" />
                  <span>{deck.cardsCount} Cards</span>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {deck.title}
                </h3>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Mastery Level</span>
                    <span className="text-emerald-500 font-bold">{deck.mastery}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                      style={{ width: `${deck.mastery}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                <span className="text-xs font-bold text-orange-500 group-hover:underline">
                  Study Deck →
                </span>
                <Sparkles size={16} className="text-slate-400 group-hover:text-orange-400" />
              </div>
            </div>
          ))}
        </div>

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
                      <button className="flex items-center gap-1 rounded-xl bg-emerald-500/30 border border-emerald-400/40 px-4 py-1.5 text-xs font-bold text-emerald-100 hover:bg-emerald-500/40">
                        <CheckCircle2 size={14} /> Got it right
                      </button>
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
