import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { PlusCircle, Layers, FolderPlus, HelpCircle } from "lucide-react";
import flashcardApi from "../api/flashcardApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateCardPage = () => {
  const navigate = useNavigate();
  const [existingDecks, setExistingDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await flashcardApi.getFlashcards(0, 500);
        const cards = response.data?.content || [];
        
        // Group and find unique decks
        const decksMap = {};
        cards.forEach((card) => {
          if (!decksMap[card.deckId]) {
            decksMap[card.deckId] = {
              id: card.deckId,
              title: card.deckTitle,
            };
          }
        });
        setExistingDecks(Object.values(decksMap));
      } catch (error) {
        console.error("Failed to load decks:", error);
      }
    };
    fetchDecks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }
    if (!answer.trim()) {
      toast.error("Please enter an answer.");
      return;
    }

    let deckId = selectedDeckId;
    let deckTitle = "";

    if (selectedDeckId === "new") {
      if (!newDeckTitle.trim()) {
        toast.error("Please enter a title for the new deck.");
        return;
      }
      deckTitle = newDeckTitle.trim();
      deckId = ""; // Backend generates UUID if blank
    } else if (selectedDeckId) {
      const selected = existingDecks.find((d) => d.id === selectedDeckId);
      deckTitle = selected ? selected.title : "General";
    } else {
      deckTitle = "General";
      deckId = "";
    }

    try {
      setIsSubmitting(true);
      toast.loading("Creating flashcard...");
      
      await flashcardApi.createFlashcard({
        deckId,
        deckTitle,
        question: question.trim(),
        answer: answer.trim(),
      });

      toast.dismiss();
      toast.success("Flashcard created successfully!");
      
      // Clear inputs
      setQuestion("");
      setAnswer("");
      if (selectedDeckId === "new") {
        setNewDeckTitle("");
        // Redirect to library to see new card
        navigate("/library");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create flashcard.");
      console.error("Create card error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl space-y-6 pb-12">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Create Custom Flashcard
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manually write and add a single custom card to your study decks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Deck Configuration */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <Layers size={18} className="text-orange-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Deck Placement</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Target Deck</label>
                <select
                  value={selectedDeckId}
                  onChange={(e) => setSelectedDeckId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="">General Deck (Default)</option>
                  {existingDecks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                      {deck.title}
                    </option>
                  ))}
                  <option value="new">+ Create a New Deck</option>
                </select>
              </div>

              {selectedDeckId === "new" && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Deck Title</label>
                  <div className="relative mt-1.5">
                    <FolderPlus size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g., Biology Semester 1"
                      value={newDeckTitle}
                      onChange={(e) => setNewDeckTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flashcard Content */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <HelpCircle size={18} className="text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Flashcard Content</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Question (Front Side)</label>
                <textarea
                  rows={3}
                  placeholder="Type the study question or term..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Answer (Back Side)</label>
                <textarea
                  rows={4}
                  placeholder="Type the definition or answer detail..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-xs font-bold text-white shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            <PlusCircle size={16} /> Create Card
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateCardPage;
