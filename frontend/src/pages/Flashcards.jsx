import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Sparkles, Sliders, Layers, Play, CheckCircle2, RefreshCw } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import pdfApi from "../api/pdfApi";
import flashcardApi from "../api/flashcardApi";
import { toast } from "react-hot-toast";

const Flashcards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdfId, setSelectedPdfId] = useState(location.state?.selectedPdfId || "");
  const [cardCount, setCardCount] = useState(24);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [focusArea, setFocusArea] = useState("All Concepts");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPdfs, setIsLoadingPdfs] = useState(true);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setIsLoadingPdfs(true);
        const res = await pdfApi.getAllPdfs();
        const pdfList = res.data || [];
        setPdfs(pdfList);
        
        // Default to the PDF ID passed from the upload page state
        if (location.state?.selectedPdfId) {
          setSelectedPdfId(location.state.selectedPdfId.toString());
        } else if (pdfList.length > 0) {
          setSelectedPdfId(pdfList[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to load source documents:", err);
        toast.error("Failed to load PDF documents list.");
      } finally {
        setIsLoadingPdfs(false);
      }
    };
    fetchPdfs();
  }, [location.state]);

  const handleGenerate = async () => {
    if (!selectedPdfId) {
      toast.error("Please select a target source PDF document.");
      return;
    }

    try {
      setIsGenerating(true);
      // Trigger backend AI card generation
      await flashcardApi.generateFlashcards(Number(selectedPdfId), cardCount);
      toast.success("Deck generated successfully!");
      navigate("/library"); // Redirect to Personal Library to see new decks
    } catch (error) {
      console.error("Failed to generate deck:", error);
      const errMsg = error.response?.data?.message || "Failed to generate flashcards. Please check credit balance.";
      toast.error(errMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const samplePreviewCards = [
    {
      q: "What is Supervised Learning in Machine Learning?",
      a: "A learning model where the algorithm is trained on labeled data consisting of input-output pairs.",
    },
    {
      q: "Explain the difference between Overfitting and Underfitting.",
      a: "Overfitting occurs when a model learns noise in training data; Underfitting occurs when a model is too simple to capture trends.",
    },
    {
      q: "What is Gradient Descent?",
      a: "An optimization algorithm used to minimize a loss function by iteratively moving toward the minimum.",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Generate Flashcards
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Customize AI flashcard parameters and preview cards before saving.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedPdfId}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating Deck...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate {cardCount} Cards</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="glass-panel rounded-3xl p-6 lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <Sliders size={18} className="text-orange-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Generation Settings</h2>
            </div>

            {/* Target Document */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Source Document
              </label>
              {isLoadingPdfs ? (
                <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                  <RefreshCw size={14} className="animate-spin" /> Loading documents...
                </div>
              ) : pdfs.length === 0 ? (
                <div className="mt-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
                  No source documents found.{" "}
                  <Link to="/upload" className="text-orange-500 font-bold hover:underline">
                    Upload a PDF document first
                  </Link>
                </div>
              ) : (
                <select
                  value={selectedPdfId}
                  onChange={(e) => setSelectedPdfId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  {pdfs.map((pdf) => (
                    <option key={pdf.id} value={pdf.id.toString()}>
                      {pdf.filename}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Card Count Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Number of Flashcards</span>
                <span className="text-orange-500">{cardCount} Cards</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="2"
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="mt-3 w-full accent-orange-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>10 Quick</span>
                <span>24 Recommended</span>
                <span>50 Deep Dive</span>
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Difficulty / Depth
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["Basic", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`rounded-xl py-2 text-xs font-bold transition-all ${
                      difficulty === level
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                        : "border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Topic */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Focus Subject Area
              </label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              >
                <option>All Concepts & Definitions</option>
                <option>Key Formulas & Algorithms</option>
                <option>Short Questions & Answers</option>
                <option>True / False Practice</option>
              </select>
            </div>
          </div>

          {/* Cards Preview Column */}
          <div className="glass-panel rounded-3xl p-6 lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Sample Preview</h2>
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                3 of {cardCount} Cards Previewed
              </span>
            </div>

            <div className="space-y-3">
              {samplePreviewCards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-zinc-900/60 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-orange-500 uppercase tracking-wider">
                      Card #{idx + 1}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                      <CheckCircle2 size={12} /> High Quality Match
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Q: {card.q}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    A: {card.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedPdfId}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}
                <span>Confirm &amp; Generate Complete Deck</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Flashcards;
