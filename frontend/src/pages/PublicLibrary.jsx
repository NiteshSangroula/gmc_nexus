import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  Library,
  Search,
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Trash2,
  Globe,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Calendar,
} from "lucide-react";
import flashcardApi from "../api/flashcardApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const PublicLibraryPage = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest"); // "newest", "likes", "comments"

  // Reaction & forum replies states
  const [activeTab, setActiveTab] = useState("practice"); // "practice" or "forum"
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0, userReaction: "NONE" });
  const [replies, setReplies] = useState([]);
  const [newReplyMessage, setNewReplyMessage] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [postingReply, setPostingReply] = useState(false);

  const fetchDecks = async () => {
    try {
      setIsLoading(true);
      const response = await flashcardApi.getPublicFlashcards(0, 500);
      const cards = response.data?.content || [];
      
      const decksMap = {};
      cards.forEach((card) => {
        if (!card.deckId) return; // Skip invalid cards
        
        if (!decksMap[card.deckId]) {
          const title = card.deckTitle || "Untitled Deck";
          const isAi = title.toLowerCase().endsWith(".pdf");
          decksMap[card.deckId] = {
            id: card.deckId,
            title: title,
            category: isAi ? "AI Generated" : "Custom Deck",
            ownerId: card.ownerId,
            likesCount: card.likesCount || 0,
            commentsCount: card.commentsCount || 0,
            cards: [],
          };
        }
        decksMap[card.deckId].cards.push({
          id: card.id,
          q: card.question || "",
          a: card.answer || "",
        });
      });
      
      const decksList = Object.values(decksMap);
      setDecks(decksList);
    } catch (error) {
      toast.error("Failed to load public library.");
      console.error("Public Library fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  // Safe crash-proof search filtering
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

  const sortedAndFilteredDecks = [...filteredDecks].sort((a, b) => {
    if (sortBy === "likes") {
      return (b.likesCount || 0) - (a.likesCount || 0);
    }
    if (sortBy === "comments") {
      return (b.commentsCount || 0) - (a.commentsCount || 0);
    }
    return 0; // maintain default chronological ordering
  });

  const openDeckModal = async (deck) => {
    setSelectedDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setActiveTab("practice");
    setNewReplyMessage("");
    
    try {
      setLoadingReplies(true);
      const [reactionRes, repliesRes] = await Promise.all([
        flashcardApi.getDeckInteractions(deck.id),
        flashcardApi.getDeckReplies(deck.id)
      ]);
      setReactions(reactionRes.data || { likes: 0, dislikes: 0, userReaction: "NONE" });
      setReplies(repliesRes.data || []);
    } catch (err) {
      console.error("Failed to fetch deck reactions/comments:", err);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleNextCard = () => {
    if (!selectedDeck || !selectedDeck.cards.length) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % selectedDeck.cards.length);
  };

  const handlePrevCard = () => {
    if (!selectedDeck || !selectedDeck.cards.length) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + selectedDeck.cards.length) % selectedDeck.cards.length);
  };

  const handleDeleteDeck = async (deckId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete your deck? This action cannot be undone.")) {
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

  const handleReaction = async (isLike) => {
    try {
      const res = await flashcardApi.reactToDeck(selectedDeck.id, isLike);
      setReactions(res.data || { likes: 0, dislikes: 0, userReaction: "NONE" });
      toast.success(isLike ? "Deck liked!" : "Deck disliked!");
    } catch (error) {
      toast.error("Failed to register reaction.");
      console.error("Reaction register error:", error);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!newReplyMessage.trim()) return;

    try {
      setPostingReply(true);
      const res = await flashcardApi.addDeckReply(selectedDeck.id, newReplyMessage);
      setReplies((prev) => [...prev, res.data]);
      setNewReplyMessage("");
      toast.success("Comment posted to forum!");
    } catch (error) {
      toast.error("Failed to post comment.");
      console.error("Forum comment error:", error);
    } finally {
      setPostingReply(false);
    }
  };

  const currentUserId = user?.id;

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="text-orange-500" size={24} />
              Public Flashcard Library
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Explore study decks uploaded by students all over campus. Owners can manage their decks; others can view and study.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search specific topic, content, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Sorting / Ranking controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Rank By:</span>
            <button
              onClick={() => setSortBy("newest")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                sortBy === "newest"
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
              }`}
            >
              Default (Newest)
            </button>
            <button
              onClick={() => setSortBy("likes")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                sortBy === "likes"
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
              }`}
            >
              <ThumbsUp size={13} />
              <span>Top Liked</span>
            </button>
            <button
              onClick={() => setSortBy("comments")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                sortBy === "comments"
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
              }`}
            >
              <MessageSquare size={13} />
              <span>Top Comments</span>
            </button>
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
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No public decks found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Be the first to upload a PDF or create a custom card to show here!
            </p>
          </div>
        ) : (
          /* Deck Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedAndFilteredDecks.map((deck) => {
              const isOwner = deck.ownerId === currentUserId;
              return (
                <div
                  key={deck.id}
                  onClick={() => openDeckModal(deck)}
                  className="group glass-panel glass-panel-hover flex flex-col justify-between rounded-3xl p-6 cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        isOwner
                          ? "bg-orange-500/10 border border-orange-500/20 text-orange-500"
                          : "bg-blue-500/10 border border-blue-500/20 text-blue-500"
                      }`}
                    >
                      {isOwner ? "My Deck" : "Public Shared"}
                    </span>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1" title="Cards count">
                        <Layers size={14} className="text-amber-500" />
                        <span>{deck.cards.length}</span>
                      </span>
                      <span className="flex items-center gap-1" title="Total Likes">
                        <ThumbsUp size={13} className="text-orange-500" />
                        <span>{deck.likesCount}</span>
                      </span>
                      <span className="flex items-center gap-1" title="Total Comments">
                        <MessageSquare size={13} className="text-orange-500" />
                        <span>{deck.commentsCount}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                      {deck.title}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                    <span className="text-xs font-bold text-orange-500 group-hover:underline">
                      Study Deck &amp; Forum →
                    </span>
                    {isOwner ? (
                      <button
                        onClick={(e) => handleDeleteDeck(deck.id, e)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors"
                        title="Delete Deck"
                      >
                        <Trash2 size={15} />
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                        <User size={12} /> View Only
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3D Interactive Practice + Forum Forum Modal */}
        {selectedDeck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md overflow-y-auto animate-in fade-in">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121218] p-6 shadow-2xl my-8">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedDeck.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Card {selectedDeck.cards.length > 0 ? currentCardIndex + 1 : 0} of {selectedDeck.cards.length}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDeck(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sub-Header Tab Switcher + Reactions */}
              <div className="mt-4 flex flex-col gap-3 border-b border-slate-100 dark:border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("practice")}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      activeTab === "practice"
                        ? "bg-orange-500 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    Flashcards Practice ({selectedDeck.cards.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("forum")}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === "forum"
                        ? "bg-orange-500 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <MessageSquare size={14} />
                    Forum Discussion ({replies.length})
                  </button>
                </div>

                {/* Reaction Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReaction(true)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                      reactions.userReaction === "LIKE"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                        : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900"
                    }`}
                    title="Like Deck"
                  >
                    <ThumbsUp size={14} />
                    <span>{reactions.likes}</span>
                  </button>
                  <button
                    onClick={() => handleReaction(false)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                      reactions.userReaction === "DISLIKE"
                        ? "bg-rose-500/20 border-rose-500 text-rose-500"
                        : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900"
                    }`}
                    title="Dislike Deck"
                  >
                    <ThumbsDown size={14} />
                    <span>{reactions.dislikes}</span>
                  </button>
                </div>
              </div>

              {/* Tab Content 1: Practice */}
              {activeTab === "practice" && (
                <div>
                  <div className="my-8 perspective-1000">
                    {selectedDeck.cards.length === 0 ? (
                      <div className="min-h-[260px] flex items-center justify-center text-xs text-slate-400">
                        This deck has no cards.
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className={`relative min-h-[260px] w-full cursor-pointer rounded-3xl p-8 border border-orange-500/30 shadow-2xl transition-transform duration-500 transform-style-3d ${
                          isFlipped
                            ? "rotate-y-180 bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white"
                            : "bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white"
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
                    )}
                  </div>

                  {/* Controls Footer */}
                  {selectedDeck.cards.length > 0 && (
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
                  )}
                </div>
              )}

              {/* Tab Content 2: Forum Discussions */}
              {activeTab === "forum" && (
                <div className="space-y-4 my-6">
                  {/* Replies List */}
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {loadingReplies ? (
                      <div className="flex h-32 items-center justify-center text-slate-400 text-xs">
                        Loading comments...
                      </div>
                    ) : replies.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-zinc-900/20 rounded-2xl border border-slate-200/50 dark:border-white/5">
                        No discussion topics yet on this deck. Write the first comment below!
                      </div>
                    ) : (
                      replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-900/40 p-3.5 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                            <span className="text-orange-500 dark:text-orange-400 flex items-center gap-1">
                              <User size={12} /> {reply.username}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(reply.createdAt).toLocaleDateString()} at{" "}
                              {new Date(reply.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed break-words font-medium">
                            {reply.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Reply Form */}
                  <form onSubmit={handlePostReply} className="flex gap-2 border-t border-slate-100 dark:border-white/10 pt-4">
                    <input
                      type="text"
                      placeholder="Ask a question or post a feedback message..."
                      value={newReplyMessage}
                      onChange={(e) => setNewReplyMessage(e.target.value)}
                      disabled={postingReply}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={postingReply || !newReplyMessage.trim()}
                      className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-500 transition-all disabled:opacity-50"
                    >
                      <span>Reply</span>
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PublicLibraryPage;
