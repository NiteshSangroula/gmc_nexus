import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { CircleHelp, Search, MessageSquare, Mail, ChevronDown, Send } from "lucide-react";

const faqs = [
  {
    q: "How does the AI PDF to Flashcard conversion work?",
    a: "Our AI engine extracts raw text and formulas from your uploaded PDF, performs semantic chunking, and automatically generates high-yield Question & Answer pairs tailored to your preferred difficulty.",
  },
  {
    q: "Can I export my flashcard decks to Anki or PDF?",
    a: "Yes! On the Pro plan, you can export any flashcard deck as an Anki .apkg file or printable PDF study sheet.",
  },
  {
    q: "Is my uploaded PDF document secure and private?",
    a: "Absolutely. All uploaded documents are processed over encrypted HTTPS channels and stored in secure isolated storage. Your documents are never shared or used to train public models.",
  },
  {
    q: "How many credits are deducted per PDF document?",
    a: "Generating a standard deck of up to 25 cards consumes 1 AI credit. Pro tier subscribers enjoy unlimited credit generation.",
  },
];

const SupportPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-8 pb-12">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Help & Support Center
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Find quick answers to common questions or submit a ticket to our support team.
          </p>
        </div>

        {/* Search FAQs */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs and help topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-12 pr-4 py-3.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 shadow-sm"
          />
        </div>

        {/* FAQs Accordion */}
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>

          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/40 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left text-xs font-bold text-slate-900 dark:text-white hover:text-orange-500"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${activeFaq === index ? "rotate-180 text-orange-500" : ""}`}
                />
              </button>

              {activeFaq === index && (
                <div className="border-t border-slate-100 dark:border-white/10 px-4 py-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-zinc-900/80">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support Ticket Form */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <MessageSquare size={18} className="text-orange-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Contact AI Support Team</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject</label>
              <input
                type="text"
                placeholder="e.g. Issue parsing PDF file"
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Email</label>
              <input
                type="email"
                placeholder="rohan@example.com"
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Message</label>
            <textarea
              rows="4"
              placeholder="Describe your question or issue in detail..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            ></textarea>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105">
            <Send size={15} /> Send Message
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SupportPage;
