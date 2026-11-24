import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Instant Match Score",
    description: "Get a comprehensive 0-100% compatibility rating between your actual profile and target job description in seconds."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Targeted Question Bank",
    description: "AI-generated technical and behavioral questions specific to your role, complete with the interviewer's hidden intention and model answers."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Skill Gap Diagnostics",
    description: "Clear breakdown of missing keywords and skills categorized into low, medium, and high severity impact."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Day-by-Day Preparation Plan",
    description: "A customized study schedule breaking down exact concepts, mock questions, and exercises to prepare day-wise."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "1-Click ATS Tailored Resume",
    description: "Automatically formats and exports a customized PDF resume tailored specifically to pass ATS filters for that role."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Fast Gemini AI Engine",
    description: "Powered by Google's cutting-edge Gemini models with smart fallback and intelligent context awareness."
  }
];

const STEPS = [
  {
    step: "01",
    title: "Input Target Role & Profile",
    description: "Paste any job description and upload your resume PDF (or type a short self-summary)."
  },
  {
    step: "02",
    title: "AI Deep Analysis",
    description: "Our AI maps your experience against candidate benchmarks and extracts interview expectations."
  },
  {
    step: "03",
    title: "Practice & Download",
    description: "Review top technical questions, practice model answers, study your roadmap, and export an ATS resume."
  }
];

const FAQS = [
  {
    q: "Kya resume upload karna zaroori hai?",
    a: "Nahi! Agar aapke paas resume file nahi hai, toh aap 'Quick Self-Description' box me apne skills aur experience likh kar bhi instant plan generate kar sakte hain."
  },
  {
    q: "AI konse questions generate karta hai?",
    a: "Ye aapke target job aur experience ke hisaab se actual technical questions aur scenario-based behavioral questions prepare karta hai, sath hi unka purpose aur sample answers bhi deta hai."
  },
  {
    q: "Kya customized resume PDF download kar sakte hain?",
    a: "Haan! Report generate hone ke baad 'Download Resume' button par click karke aap 1-click tailored ATS-friendly PDF download kar sakte hain."
  },
  {
    q: "Kya ye service free hai?",
    a: "Haan, bilkul! Aap free account register karke unlimited interview preparation strategies bana sakte hain."
  }
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0d1117]/80 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
              G
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight">
              GenAI <span className="text-pink-500">JobPrep</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-pink-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-pink-400 transition-colors">How It Works</a>
            <a href="#faqs" className="hover:text-pink-400 transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-all shadow-md shadow-pink-500/20 active:scale-95"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-all shadow-md shadow-pink-500/20 active:scale-95"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-medium text-pink-400 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            Powered by Next-Gen Google Gemini AI
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-100 leading-tight">
            Crack Your Dream Tech Job With <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500 bg-clip-text text-transparent">
              Personalized AI Interview Prep
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            Upload your resume and paste your target job description. Get tailored technical questions, model answers, skill gap insights, and an ATS-ready resume in seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto rounded-xl bg-pink-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-pink-500/25 hover:bg-pink-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Start Preparing Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-[#161b22] px-7 py-3.5 text-base font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-colors"
            >
              Already Have an Account?
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-y border-slate-800/80 py-6 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-pink-400">100%</p>
              <p className="text-xs text-slate-400 mt-1">Role-Specific Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">Day-Wise</p>
              <p className="text-xs text-slate-400 mt-1">Structured Roadmap</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">ATS Friendly</p>
              <p className="text-xs text-slate-400 mt-1">PDF Resume Export</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">Instant</p>
              <p className="text-xs text-slate-400 mt-1">AI Match Compatibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-16 bg-[#161b22]/40 border-y border-slate-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-400">How It Works</h2>
            <p className="mt-2 text-3xl font-bold text-slate-100">Simple 3-Step Preparation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, idx) => (
              <div key={idx} className="relative rounded-2xl border border-slate-800 bg-[#161b22] p-6 shadow-lg hover:border-slate-700 transition-colors">
                <span className="text-4xl font-extrabold text-pink-500/20">{step.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-100">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-400">Features</h2>
            <p className="mt-2 text-3xl font-bold text-slate-100">Everything You Need to Ace The Interview</p>
            <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
              Customized specifically to your target job role, experience level, and tech stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-[#161b22] p-6 transition-all hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/5 group"
              >
                <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-100">{feat.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs Section ── */}
      <section id="faqs" className="py-16 bg-[#161b22]/40 border-t border-slate-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-400">FAQs</h2>
            <p className="mt-2 text-3xl font-bold text-slate-100">Frequently Asked Questions</p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#161b22] overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === idx ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-sm text-slate-400 border-t border-slate-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-b from-pink-500/10 to-[#161b22] p-8 sm:p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">
              Ready to Stand Out in Your Next Interview?
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Join now, analyze your target job requirements, and get an unfair advantage in tech interviews.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="rounded-xl bg-pink-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-pink-500/25 hover:bg-pink-600 transition-all active:scale-95"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-slate-800 bg-[#0d1117] py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} GenAI JobPrep. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
