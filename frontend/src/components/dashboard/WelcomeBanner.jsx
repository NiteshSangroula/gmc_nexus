import { Sparkles, Upload, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const WelcomeBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-xl">

      {/* Background Decorations */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-indigo-300/20 blur-2xl"></div>

      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

        {/* Left Side */}
        <div className="max-w-2xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-md">
            <Sparkles size={18} />
            <span className="text-sm font-medium">
              AI Powered Learning
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Welcome back,
            <span className="block text-indigo-100">
              Ready to master your next subject?
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-indigo-100 text-lg leading-relaxed">
            Upload your PDF notes and let AI generate beautiful flashcards
            instantly. Study smarter, revise faster, and retain more.
          </p>

          <div className="mt-8 flex gap-4">

            <Link
              to="/upload"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:scale-105 hover:shadow-lg"
            >
              <Upload size={18} />
              Upload PDF
            </Link>

            <button className="flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 backdrop-blur-md transition hover:bg-white/10">
              Learn More
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

        {/* Right Side */}

        <div className="hidden lg:flex">

          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg">

            <div className="grid grid-cols-2 gap-6">

              <div>
                <p className="text-4xl font-bold">
                  250+
                </p>

                <p className="mt-2 text-indigo-100">
                  Flashcards
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold">
                  12
                </p>

                <p className="mt-2 text-indigo-100">
                  PDFs
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold">
                  95%
                </p>

                <p className="mt-2 text-indigo-100">
                  Accuracy
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold">
                  AI
                </p>

                <p className="mt-2 text-indigo-100">
                  Powered
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default WelcomeBanner;