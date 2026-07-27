import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { History, Search, FileText, CheckCircle2, RefreshCw, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pdfApi from "../api/pdfApi";
import flashcardApi from "../api/flashcardApi";
import { toast } from "react-hot-toast";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistoryData = async () => {
    try {
      setIsLoading(true);
      const [pdfRes, cardsRes] = await Promise.all([
        pdfApi.getAllPdfs(),
        flashcardApi.getFlashcards(0, 500)
      ]);

      const pdfList = pdfRes.data || [];
      const cardsList = cardsRes.data?.content || [];

      // Map card counts by lowercase deckTitle
      const cardsCountMap = {};
      cardsList.forEach((card) => {
        const key = card.deckTitle?.toLowerCase() || "";
        cardsCountMap[key] = (cardsCountMap[key] || 0) + 1;
      });

      const historyItems = pdfList.map((pdf) => {
        const key = pdf.filename?.toLowerCase() || "";
        const cardsCount = cardsCountMap[key] || 0;
        return {
          id: pdf.id,
          title: pdf.filename || "Unnamed Document",
          date: new Date(pdf.uploadedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          cards: cardsCount,
          status: cardsCount > 0 ? "Completed" : "Uploaded",
        };
      });

      setHistory(historyItems);
    } catch (err) {
      console.error("Failed to load generation history:", err);
      toast.error("Failed to load generation history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleRegenerate = (pdfId) => {
    navigate("/flashcards", { state: { selectedPdfId: pdfId } });
  };

  const handleDelete = async (pdfId) => {
    if (!window.confirm("Are you sure you want to delete this PDF and its generated flashcards?")) {
      return;
    }

    try {
      toast.loading("Deleting document and decks...");
      await pdfApi.deletePdf(pdfId);
      toast.dismiss();
      toast.success("Document deleted successfully!");
      setHistory((prev) => prev.filter((item) => item.id !== pdfId));
    } catch (err) {
      toast.dismiss();
      console.error("Delete PDF error:", err);
      toast.error("Failed to delete document.");
    }
  };

  const filteredLogs = history.filter((log) =>
    log.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="text-orange-500" size={24} />
              Generation History
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Review all your previous PDF conversions and manage generated flashcard decks.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search history logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* History Table Container */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={48} className="mx-auto text-slate-300 dark:text-zinc-700" />
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No history records found</h3>
              <p className="mt-1 text-xs text-slate-500">
                You haven't converted any PDFs yet. Upload one to get started!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-zinc-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Document</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Cards</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {filteredLogs.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                            <FileText size={18} />
                          </div>
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.date}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {item.cards > 0 ? `${item.cards} cards` : "0 cards"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            item.status === "Completed"
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRegenerate(item.id)}
                            title="Re-generate / Custom Settings"
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 font-bold text-orange-500 hover:bg-orange-500/10 transition-colors"
                          >
                            <span>Convert Settings</span>
                            <ArrowRight size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Document"
                            className="rounded-lg p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
