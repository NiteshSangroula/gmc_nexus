import MainLayout from "../layouts/MainLayout";
import { Coins, Clock, Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const creditPacks = [
  { id: 1, amount: 50, price: "NPR 299", popular: false },
  { id: 2, amount: 200, price: "NPR 799", popular: true },
  { id: 3, amount: 500, price: "NPR 1,499", popular: false },
];

const CreditsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Credits & Usage Analytics
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Monitor your daily conversion credit balance, usage stats, and credit top-up options.
          </p>
        </div>

        {/* Current Balance Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="human-card rounded-3xl p-6 md:col-span-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500 border border-amber-500/20">
                  <Coins size={20} />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daily Credit Allowance</h2>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Clock size={12} className="text-orange-500" /> Resets in 10h 24m
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">23</span>
                <span className="text-base font-semibold text-slate-400">/ 50 Credits Available</span>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>46% Balance Remaining</span>
                  <span>27 Credits Used Today</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div className="h-full w-[46%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                to="/premium"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105"
              >
                <Sparkles size={16} /> Upgrade to Unlimited
              </Link>
            </div>
          </div>

          {/* Credit Packs */}
          <div className="human-card rounded-3xl p-6 md:col-span-6 space-y-4">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Buy Extra Credit Boost Packs</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Instant one-time credits that never expire</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {creditPacks.map((pack) => (
                <div
                  key={pack.id}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    pack.popular
                      ? "border-orange-500 bg-orange-500/10 shadow-md"
                      : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/40"
                  }`}
                >
                  <span className="text-xs font-extrabold text-orange-500">+{pack.amount} Credits</span>
                  <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">{pack.price}</div>
                  <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-orange-500 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-orange-600">
                    <Plus size={12} /> Buy Pack
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreditsPage;
