import { useState } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useParams } from "react-router";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

// Tailwind needs full class names (no dynamic string building), so the
// severity -> classes lookup lives here.
const SEVERITY_CLASSES = {
  low: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};
const SEVERITY_FALLBACK = "border-slate-600 bg-slate-700/30 text-slate-300";

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#161b22]">
      <div
        className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-slate-800/40"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="shrink-0 rounded-md bg-pink-500/15 px-2 py-0.5 text-xs font-semibold text-pink-400">
          Q{index + 1}
        </span>
        <p className="flex-1 text-sm font-medium text-slate-100 sm:text-base">
          {item.question}
        </p>
        <span
          className={`mt-0.5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {open && (
        <div className="flex flex-col gap-4 border-t border-slate-800 p-4">
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-medium text-sky-300">
              Intention
            </span>
            <p className="text-sm leading-relaxed text-slate-300">
              {item.intention}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
              Model Answer
            </span>
            <p className="text-sm leading-relaxed text-slate-300">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
    <div className="mb-3 flex flex-wrap items-center gap-3">
      <span className="rounded-md bg-pink-500 px-2.5 py-0.5 text-xs font-semibold text-white">
        Day {day.day}
      </span>
      <h3 className="text-base font-semibold text-slate-100">{day.focus}</h3>
    </div>
    <ul className="flex flex-col gap-2">
      {day.tasks.map((task, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { interviewId } = useParams();
  const { report, loading, resumeLoading, getResumePdf } = useInterview(interviewId);

  if (loading || !report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4 text-center text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-pink-500" />
          <h1 className="text-xl font-semibold">Loading your interview plan...</h1>
        </div>
      </main>
    );
  }

  const scoreColor =
    report.matchScore >= 80
      ? "border-emerald-400 text-emerald-400"
      : report.matchScore >= 60
        ? "border-amber-400 text-amber-400"
        : "border-rose-400 text-rose-400";

  return (
    <div className="min-h-screen bg-[#0d1117] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:gap-0">
        {/* ── Left Nav ── */}
        <nav className="flex shrink-0 flex-col justify-between gap-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-64 lg:pr-6">
          <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            <p className="hidden px-3 pb-1 text-xs font-medium text-slate-500 lg:block">
              Sections
            </p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${activeNav === item.id ? "bg-pink-500/15 text-pink-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <button
            disabled={resumeLoading}
            onClick={() => {
              getResumePdf(interviewId);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {resumeLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating ATS Resume...
              </>
            ) : (
              <>
                <svg
                  height={"0.8rem"}
                  style={{ marginRight: "0.8rem" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
                </svg>
                Download Resume
              </>
            )}
          </button>
        </nav>

        <div className="h-px w-full bg-slate-800 lg:h-auto lg:w-px" />

        {/* ── Center Content ── */}
        <main className="min-w-0 flex-1 lg:px-6">
          {activeNav === "technical" && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Technical Questions</h2>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  {report.technicalQuestions.length} questions
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Behavioral Questions</h2>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  {report.behavioralQuestions.length} questions
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Preparation Road Map</h2>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  {report.preparationPlan.length}-day plan
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {report.preparationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="h-px w-full bg-slate-800 lg:h-auto lg:w-px" />

        {/* ── Right Sidebar ── */}
        <aside className="flex shrink-0 flex-col gap-6 lg:w-72 lg:pl-6">
          {/* Match Score */}
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-medium text-slate-400">Match Score</p>
            <div
              className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${scoreColor}`}
            >
              <span className="text-3xl font-bold">{report.matchScore}</span>
              <span className="mt-2 text-sm font-semibold">%</span>
            </div>
            <p className="text-xs text-slate-500">Strong match for this role</p>
          </div>

          <div className="h-px w-full bg-slate-800" />

          {/* Skill Gaps */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-slate-400">Skill Gaps</p>
            <div className="flex flex-wrap gap-2">
              {report.skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${SEVERITY_CLASSES[gap.severity] || SEVERITY_FALLBACK}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
