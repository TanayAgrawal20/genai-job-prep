import { useState, useRef } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { useNavigate, Link } from "react-router";

const Home = () => {
  const { loading, generateReport, reports } = useInterview(null);
  const { user, handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [activeTab, setActiveTab] = useState("resume"); // "resume" or "self"
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        setFileName("");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setError("File size exceeds 3MB limit.");
        setFileName("");
        return;
      }
      setFileName(file.name);
      setError("");
    }
  };

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];
    if (!jobDescription.trim()) {
      setError("Please provide target job description.");
      return;
    }
    if (!resumeFile && !selfDescription.trim()) {
      setError("Please either upload a resume PDF or enter a quick self-description.");
      return;
    }

    setError("");
    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      navigate(`/interview/${data._id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to generate the interview plan.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4 text-center text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-pink-500/20" />
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-pink-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Analyzing Profile & Job Description...</h2>
            <p className="mt-1 text-sm text-slate-400">Our AI is mapping skill gaps and extracting targeted questions (~20s)</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0d1117] text-slate-100 flex flex-col overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* ── Top Bar ── */}
      <header className="h-14 shrink-0 border-b border-slate-800 bg-[#161b22]/70 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              G
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight">
              GenAI <span className="text-pink-500">JobPrep</span>
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
            Workspace
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs font-medium text-slate-300 hidden md:block">
              Welcome, <span className="text-pink-400 font-semibold">{user.username}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Main Workspace Body (Fit to Screen) ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4 max-w-[1600px] w-full mx-auto">
        {/* Left Side: Create Plan Studio (Takes dominant space, internal scrolling if needed) */}
        <main className="flex-1 flex flex-col rounded-2xl border border-slate-800 bg-[#161b22] shadow-2xl overflow-hidden min-h-0">
          {/* Header Inside Studio */}
          <div className="shrink-0 px-5 py-3.5 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/60 to-transparent flex items-center justify-between">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Create Interview Plan</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/20">
                  AI Strategy
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyze job requirements and generate questions, roadmap & ATS resume.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 3.6 Flash Active
              </span>
            </div>
          </div>

          {/* Studio Inputs: Split 2 Column Layout (Fit to Screen) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-5 overflow-y-auto min-h-0">
            {/* Column 1: Job Description */}
            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <span className="text-pink-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Job Description
                </label>
                <span className="text-[11px] text-slate-500">{jobDescription.length}/5000</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
                placeholder="Paste the target job description here... (e.g. Senior Frontend Engineer at Google requiring React, TypeScript, System Design...)"
                className="w-full flex-1 min-h-[140px] resize-none rounded-xl border border-slate-700/80 bg-[#0d1117] p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/40 transition-all leading-relaxed"
              />
            </div>

            {/* Column 2: Candidate Profile (Tabs: Upload Resume vs Self Description) */}
            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span className="text-pink-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  Your Profile
                </span>
                {/* Mode Selector Tabs */}
                <div className="flex rounded-lg bg-[#0d1117] p-0.5 border border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => setActiveTab("resume")}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${activeTab === "resume" ? "bg-pink-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    Resume PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("self")}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${activeTab === "self" ? "bg-pink-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    Self Description
                  </button>
                </div>
              </div>

              {/* Tab 1: Upload Resume Box */}
              {activeTab === "resume" ? (
                <div className="flex-1 flex flex-col justify-center min-h-[140px] rounded-xl border-2 border-dashed border-slate-700/80 bg-[#0d1117] p-4 text-center hover:border-pink-500/60 transition-all group relative">
                  <input
                    ref={resumeInputRef}
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <div className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    {fileName ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{fileName}</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-slate-200">
                          Click to upload or drag &amp; drop resume
                        </p>
                        <p className="text-[11px] text-slate-500">PDF format (Max 3MB)</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* Tab 2: Quick Self Description */
                <textarea
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Describe your tech stack, years of experience, key projects and skills..."
                  className="w-full flex-1 min-h-[140px] resize-none rounded-xl border border-slate-700/80 bg-[#0d1117] p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/40 transition-all leading-relaxed"
                />
              )}
            </div>
          </div>

          {/* Error Banner if any */}
          {error && (
            <div className="shrink-0 mx-4 mb-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs text-rose-400 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-200">✕</button>
            </div>
          )}

          {/* Studio Footer / Action Bar */}
          <div className="shrink-0 border-t border-slate-800 bg-[#11161d] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400 text-center sm:text-left">
              ⚡ Instant generation with Question Bank, Road Map & ATS Resume
            </span>
            <button
              onClick={handleGenerateReport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:bg-pink-600 transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              Generate Strategy
            </button>
          </div>
        </main>

        {/* Right Side: Recent Plans Sidebar (Compact & Scrollable, perfectly fits screen) */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col rounded-2xl border border-slate-800 bg-[#161b22] shadow-2xl overflow-hidden min-h-0">
          <div className="shrink-0 px-4 py-3.5 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/60 to-transparent flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>Recent Plans</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-pink-400 font-bold">
                {reports.length}
              </span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/interview/${report._id}`)}
                  className="group cursor-pointer rounded-xl border border-slate-800/80 bg-[#0d1117] p-3 transition-all hover:border-pink-500/50 hover:bg-slate-900/80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-pink-400 transition-colors">
                      {report.title || "Untitled Role"}
                    </h3>
                    <span
                      className={`shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        report.matchScore >= 80
                          ? "bg-emerald-500/15 text-emerald-400"
                          : report.matchScore >= 60
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {report.matchScore}%
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {new Date(report.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <svg className="w-8 h-8 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs font-medium">No plans yet</p>
                <p className="text-[11px] mt-0.5 text-slate-600">Your created strategies will appear here</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
