import { Sparkles, BrainCircuit, BookOpenCheck } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b0c10] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Decorative Left Side Banner - Visual Feature Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 p-12 flex-col justify-between relative overflow-hidden text-white">
        {/* Subtle geometric backdrop patterns */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
            <BrainCircuit size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">GMC Nexus</h1>
            <p className="text-xs text-orange-100 font-medium">AI PDF to Flashcard Engine</p>
          </div>
        </div>

        {/* Hero Quote & Showcase Card */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <Sparkles size={14} className="text-amber-200" /> Transform Documents in Seconds
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Turn dense study material into active recall flashcards.
          </h2>
          <p className="text-orange-100 text-sm leading-relaxed">
            Upload course notes, textbooks, and research papers. Our AI extract key concepts, definitions, and questions so you master your exams 3x faster.
          </p>

          {/* Key Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 font-bold">
                ⚡
              </div>
              <div>
                <div className="text-sm font-bold">Automated Concept Extraction</div>
                <div className="text-xs text-orange-200">Parse PDFs and instant Q&A pair creation</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 font-bold">
                🎯
              </div>
              <div>
                <div className="text-sm font-bold">Active Recall & Spaced Review</div>
                <div className="text-xs text-orange-200">Retain study material efficiently</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-orange-200 flex items-center justify-between border-t border-white/15 pt-6">
          <span>© 2026 GMC Nexus. All rights reserved.</span>
          <span className="flex items-center gap-1 font-medium"><BookOpenCheck size={14} /> Smart Study System</span>
        </div>
      </div>

      {/* Right Side Form Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo Header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-orange-500 font-black text-2xl">
              <BrainCircuit size={30} /> GMC Nexus
            </div>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Render Form Children */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
