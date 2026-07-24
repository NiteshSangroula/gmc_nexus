import { useState } from "react";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";

const chartData = [
  { day: "Mon", score: 35 },
  { day: "Tue", score: 62 },
  { day: "Wed", score: 45 },
  { day: "Thu", score: 75, active: true },
  { day: "Fri", score: 58 },
  { day: "Sat", score: 82 },
  { day: "Sun", score: 68 },
];

const DailyProgressChart = () => {
  const [timeframe, setTimeframe] = useState("This Week");

  return (
    <div className="human-card rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Weekly Practice Activity</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Study frequency & score tracking</p>
          </div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
          </select>
        </div>

        {/* SVG Line Chart */}
        <div className="mt-6 relative">
          <div className="h-44 w-full flex flex-col justify-between relative">
            {/* Grid Y lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 dark:text-slate-600 pointer-events-none">
              <div className="border-b border-slate-200/60 dark:border-white/5 pb-1">100%</div>
              <div className="border-b border-slate-200/60 dark:border-white/5 pb-1">75%</div>
              <div className="border-b border-slate-200/60 dark:border-white/5 pb-1">50%</div>
              <div className="border-b border-slate-200/60 dark:border-white/5 pb-1">25%</div>
              <div>0%</div>
            </div>

            {/* SVG Path line */}
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 350 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d="M 10,95 Q 60,55 110,80 T 210,35 T 310,20 L 310,130 L 10,130 Z"
                fill="url(#orangeGradient)"
              />

              {/* Line Stroke */}
              <path
                d="M 10,95 Q 60,55 110,80 T 210,35 T 310,20"
                fill="none"
                stroke="#ea580c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Node points */}
              <circle cx="10" cy="95" r="4" className="fill-orange-600 stroke-white dark:stroke-zinc-900" strokeWidth="2" />
              <circle cx="60" cy="55" r="4" className="fill-orange-600 stroke-white dark:stroke-zinc-900" strokeWidth="2" />
              <circle cx="110" cy="80" r="4" className="fill-orange-600 stroke-white dark:stroke-zinc-900" strokeWidth="2" />
              
              {/* Highlighted active node */}
              <g className="animate-pulse">
                <circle cx="185" cy="35" r="6" className="fill-orange-600 stroke-white dark:stroke-zinc-900" strokeWidth="2" />
                <circle cx="185" cy="35" r="11" className="fill-orange-500/30" />
              </g>

              <circle cx="260" cy="22" r="4" className="fill-orange-600 stroke-white dark:stroke-zinc-900" strokeWidth="2" />
              <circle cx="310" cy="40" r="4" className="fill-orange-600 stroke-white dark:stroke-zinc-900" strokeWidth="2" />
            </svg>

            {/* Hover Tooltip */}
            <div className="absolute top-1 left-[50%] -translate-x-1/2 rounded-lg bg-slate-900 dark:bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-md border border-orange-500/30">
              75% Accuracy
            </div>
          </div>

          {/* Days Label row */}
          <div className="mt-4 flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
            {chartData.map((item) => (
              <span key={item.day} className={item.active ? "text-orange-600 dark:text-orange-400 font-extrabold" : ""}>
                {item.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/10 pt-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <Clock size={14} className="text-orange-500" />
            <span>Total Practice Time</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">6h 45m</span>
            <span className="flex items-center text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={10} className="mr-0.5" /> +12%
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <CheckCircle size={14} className="text-emerald-500" />
            <span>Cards Completed</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">128</span>
            <span className="flex items-center text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={10} className="mr-0.5" /> +18%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyProgressChart;
