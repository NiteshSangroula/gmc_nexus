import { Upload, BookOpen, FileText, Folder, CheckCircle2, ChevronRight } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Upload Notes",
    desc: "PDF notes, slides, or chapters",
    icon: Upload,
    color: "from-orange-500 to-amber-500",
  },
  {
    step: 2,
    title: "Key Concepts",
    desc: "Extract definitions & terms",
    icon: BookOpen,
    color: "from-amber-500 to-yellow-500",
  },
  {
    step: 3,
    title: "Generate Deck",
    desc: "Create Q&A active recall cards",
    icon: FileText,
    color: "from-rose-500 to-orange-500",
  },
  {
    step: 4,
    title: "Organize",
    desc: "Save into subject folders",
    icon: Folder,
    color: "from-emerald-500 to-teal-500",
  },
  {
    step: 5,
    title: "Practice & Recall",
    desc: "Review cards & test memory",
    icon: CheckCircle2,
    color: "from-blue-500 to-indigo-500",
  },
];

const HowItWorks = () => {
  return (
    <div className="human-card rounded-3xl p-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">How it works</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            5 simple steps from raw document to active recall mastery
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={item.step} className="group relative flex flex-col items-center text-center">
              {/* Step Circle Icon */}
              <div className="relative mb-3 flex h-13 w-13 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white shadow-xs transition-all duration-200 group-hover:border-orange-500/50">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-xs`}>
                  <Icon size={18} />
                </div>

                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-extrabold text-white shadow-xs">
                  {item.step}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Step {item.step}
              </h3>
              <p className="mt-0.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                {item.title}
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 max-w-[150px]">
                {item.desc}
              </p>

              {/* Connecting arrow indicator for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 -right-3 transform translate-x-1/2 text-slate-300 dark:text-zinc-700">
                  <ChevronRight size={18} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
