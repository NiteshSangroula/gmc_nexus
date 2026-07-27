import { Gem, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumCard = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to from-zinc-900 via-slate-900 to-black dark:from-[#151520] dark:via-[#13131c] dark:to-[#0b0b10] p-6 text-white border border-orange-500/30 shadow-xl">
      {/* Background glowing ambient light */}
      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-orange-500/25 blur-3xl pointer-events-none"></div>

      <div className="relative flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-orange-500/20 p-2 text-orange-400 border border-orange-500/30">
            <Gem size={18} />
          </div>
          <h3 className="text-base font-bold text-white">Premium Plan</h3>
        </div>
        <span className="rounded-full bg-linear-to from-orange-500 to-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-xs">
          Pro
        </span>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-55">
            Unlimited flashcard generation, priority OCR & printable PDF export.
          </p>

          <Link
            to="/premium"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to from-orange-500 via-amber-500 to-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all hover:scale-105"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Diamond graphic icon */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 shadow-lg">
          <Sparkles size={28} />
        </div>
      </div>
    </div>
  );
};

export default PremiumCard;
