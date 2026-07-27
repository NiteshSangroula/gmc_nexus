import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Crown, Gem, Check, Sparkles, Zap, ShieldCheck } from "lucide-react";

const PremiumPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Starter Free",
      price: "NPR 0",
      period: "forever",
      desc: "Essential features for casual learners & trial users.",
      features: [
        "Up to 50 flashcards / month",
        "Max 10MB PDF upload size",
        "Standard AI processing speed",
        "Basic flashcard study deck",
      ],
      popular: false,
      buttonText: "Current Active Plan",
      disabled: true,
    },
    {
      id: "pro",
      name: "Pro Learner",
      price: isAnnual ? "NPR 799" : "NPR 999",
      period: "per month",
      desc: "For students & power users needing unlimited flashcard AI.",
      features: [
        "Unlimited flashcard generations",
        "Max 100MB PDF upload size",
        "Priority AI processing speed",
        "OCR image & scanned PDF parser",
        "Export decks to Anki & PDF",
        "24/7 Priority Support",
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
      disabled: false,
    },
    {
      id: "enterprise",
      name: "Team & Campus",
      price: isAnnual ? "NPR 2,499" : "NPR 2,999",
      period: "per month",
      desc: "Custom AI models and shared workspaces for institutions.",
      features: [
        "Everything in Pro Plan",
        "Unlimited team workspace seats",
        "Custom fine-tuned AI prompts",
        "SSO & Security Compliance",
        "Dedicated Account Manager",
      ],
      popular: false,
      buttonText: "Contact Enterprise",
      disabled: false,
    },
  ];

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-8 pb-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-1 text-xs font-bold text-orange-500">
            <Crown size={14} />
            <span>Unlock Unlimited Study Potential</span>
          </div>

          <h1 className="text-3xl font-extrabold sm:text-4xl text-slate-900 dark:text-white">
            Simple, Transparent Pricing (NPR)
          </h1>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upgrade your account to generate unlimited flashcard decks with lightning-fast AI priority processing.
          </p>

          {/* Billing Switcher */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!isAnnual ? "text-orange-500" : "text-slate-500"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-6 w-12 rounded-full bg-orange-500 p-1 transition-colors"
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${isAnnual ? "text-orange-500" : "text-slate-500"}`}>
                Annual Billing
              </span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-500">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Tier Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`human-card relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 ${
                plan.popular
                  ? "border-2 border-orange-500 bg-gradient-to-b from-orange-500/10 via-slate-900/10 to-transparent dark:from-orange-500/15 shadow-2xl scale-105"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {plan.popular ? <Gem size={20} className="text-orange-500" /> : <Zap size={18} className="text-slate-400" />}
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 min-h-[32px]">
                  {plan.desc}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400">/ {plan.period}</span>
                </div>

                <div className="mt-6 space-y-2.5">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
                        <Check size={10} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/10">
                <button
                  disabled={plan.disabled}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all ${
                    plan.disabled
                      ? "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      : plan.popular
                      ? "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:scale-105"
                      : "border border-orange-500/40 text-orange-500 hover:bg-orange-500/10"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Guarantee Badge */}
        <div className="human-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-orange-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                14-Day Money Back Guarantee
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Try Pro risk-free. Cancel anytime with zero questions asked.
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-orange-500">
            Encrypted & Secure Payment (eSewa / Khalti / Fonepay)
          </span>
        </div>
      </div>
    </MainLayout>
  );
};

export default PremiumPage;
