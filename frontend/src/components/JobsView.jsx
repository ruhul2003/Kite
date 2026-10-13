"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Search,
  Plus,
  Bookmark,
  CheckCircle2,
  UserCheck,
  ExternalLink,
  X,
  Send,
  Users,
  Trash2,
  ChevronRight,
  Filter,
} from "lucide-react";
import { apiFetchJobs, apiCreateJob, apiApplyToJob, apiDeleteJob } from "../utils/api";

export default function JobsView({ currentUser, onOpenChatWithUser }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("explore"); // 'explore' | 'saved' | 'applied' | 'manage'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedExp, setSelectedExp] = useState("All");
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);

  // Saved Jobs (Stored in localStorage)
  const [savedJobIds, setSavedJobIds] = useState([]);

  // Modals
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // New Job Form State (Recruiter)
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobLogo, setNewJobLogo] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobIsRemote, setNewJobIsRemote] = useState(false);
  const [newJobType, setNewJobType] = useState("Full-time");
  const [newJobExp, setNewJobExp] = useState("Mid Level");
  const [newJobSalary, setNewJobSalary] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobReqs, setNewJobReqs] = useState("");
  const [newJobSkills, setNewJobSkills] = useState("");
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [postJobError, setPostJobError] = useState("");

  // Application Form State (Seeker)
  const [applicantName, setApplicantName] = useState(currentUser?.name || "");
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.email || "");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantResume, setApplicantResume] = useState("");
  const [applicantNote, setApplicantNote] = useState("");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // Load Saved Jobs from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("kite_saved_jobs") || "[]");
      setSavedJobIds(saved);
    } catch {
      setSavedJobIds([]);
    }
  }, []);

  // Fetch Jobs
  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetchJobs({
        search: searchQuery,
        type: selectedType,
        experience: selectedExp,
        remote: isRemoteOnly,
      });
      setJobs(data);
      if (data.length > 0 && !selectedJob) {
        setSelectedJob(data[0]);
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [searchQuery, selectedType, selectedExp, isRemoteOnly]);

  const toggleSaveJob = (jobId) => {
    let updated;
    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter((id) => id !== jobId);
    } else {
      updated = [...savedJobIds, jobId];
    }
    setSavedJobIds(updated);
    localStorage.setItem("kite_saved_jobs", JSON.stringify(updated));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobCompany.trim() || !newJobLocation.trim() || !newJobDesc.trim()) {
      setPostJobError("Please fill in the job title, company, location, and description.");
      return;
    }

    setIsSubmittingJob(true);
    setPostJobError("");

    try {
      const jobPayload = {
        title: newJobTitle.trim(),
        company: newJobCompany.trim(),
        companyLogo: newJobLogo.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        location: newJobLocation.trim(),
        isRemote: newJobIsRemote,
        type: newJobType,
        experience: newJobExp,
        salary: newJobSalary.trim() || "Competitive",
        description: newJobDesc.trim(),
        requirements: newJobReqs
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
        skills: newJobSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        poster: {
          id: currentUser?.id || "user-recruiter-1",
          name: currentUser?.name || "Hiring Manager",
          avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          email: currentUser?.email || "recruiter@kite.com",
        },
      };

      const created = await apiCreateJob(jobPayload);
      setJobs((prev) => [created, ...prev]);
      setSelectedJob(created);
      setIsPostJobModalOpen(false);

      // Reset form
      setNewJobTitle("");
      setNewJobCompany("");
      setNewJobLogo("");
      setNewJobLocation("");
      setNewJobIsRemote(false);
      setNewJobSalary("");
      setNewJobDesc("");
      setNewJobReqs("");
      setNewJobSkills("");
    } catch (err) {
      setPostJobError(err.message || "Could not publish job listing.");
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleApplyToJob = async (e) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim()) {
      setApplyError("Please provide your full name and email.");
      return;
    }

    setIsSubmittingApp(true);
    setApplyError("");

    try {
      const appPayload = {
        userId: currentUser?.id,
        name: applicantName.trim(),
        email: applicantEmail.trim(),
        phone: applicantPhone.trim(),
        resumeUrl: applicantResume.trim(),
        coverNote: applicantNote.trim(),
      };

      await apiApplyToJob(selectedJob._id || selectedJob.id, appPayload);
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
        loadJobs();
      }, 1500);
    } catch (err) {
      setApplyError(err.message || "Failed to submit application.");
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await apiDeleteJob(jobId);
      setJobs((prev) => prev.filter((j) => (j._id || j.id) !== jobId));
      if ((selectedJob?._id || selectedJob?.id) === jobId) {
        setSelectedJob(null);
      }
    } catch (err) {
      alert(err.message || "Failed to delete job.");
    }
  };

  // Filtered views
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j._id || j.id));
  const appliedJobs = jobs.filter((j) =>
    j.applicants?.some(
      (a) => (currentUser?.id && a.userId === currentUser?.id) || a.email?.toLowerCase() === currentUser?.email?.toLowerCase()
    )
  );
  const myPostedJobs = jobs.filter(
    (j) => j.poster?.id === currentUser?.id || j.poster?.email === currentUser?.email
  );

  const displayedJobs =
    activeTab === "saved"
      ? savedJobs
      : activeTab === "applied"
      ? appliedJobs
      : activeTab === "manage"
      ? myPostedJobs
      : jobs;

  const hasAppliedToSelected = selectedJob?.applicants?.some(
    (a) => (currentUser?.id && a.userId === currentUser?.id) || a.email?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-4">
      {/* Top Header & Role Switcher */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Careers & Jobs
              </h2>
              <p className="text-xs text-slate-500">
                Discover job opportunities or post openings to hire talent
              </p>
            </div>
          </div>
        </div>

        {/* Action: Post a Job */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Job</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab("explore")}
          className={`px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "explore"
              ? "bg-white dark:bg-slate-900 text-[#1877f2] shadow-xs border border-slate-200 dark:border-slate-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Explore Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "saved"
              ? "bg-white dark:bg-slate-900 text-[#1877f2] shadow-xs border border-slate-200 dark:border-slate-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Saved Jobs ({savedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab("applied")}
          className={`px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "applied"
              ? "bg-white dark:bg-slate-900 text-[#1877f2] shadow-xs border border-slate-200 dark:border-slate-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          My Applications ({appliedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "manage"
              ? "bg-white dark:bg-slate-900 text-[#1877f2] shadow-xs border border-slate-200 dark:border-slate-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Manage Postings ({myPostedJobs.length})
        </button>
      </div>

      {/* Search & Filter Bar (Only in Explore view) */}
      {activeTab === "explore" && (
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search job title, company, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRemoteOnly(!isRemoteOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  isRemoteOnly
                    ? "bg-[#1877f2]/10 border-[#1877f2] text-[#1877f2]"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                Remote Only
              </button>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>

              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Experience</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Exec">Lead / Exec</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: Master-Detail Split Screen */}
      {displayedJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center text-slate-400 border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-base">
            No job listings found
          </h3>
          <p className="text-xs mt-1 text-slate-400">
            {activeTab === "saved"
              ? "You have not saved any jobs yet."
              : activeTab === "applied"
              ? "You have not applied to any positions yet."
              : activeTab === "manage"
              ? "You have not posted any job listings yet."
              : "Try adjusting your search criteria or post a new job."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Job Cards List (5 Cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {displayedJobs.map((job) => {
              const jobId = job._id || job.id;
              const isSelected = (selectedJob?._id || selectedJob?.id) === jobId;
              const isSaved = savedJobIds.includes(jobId);

              return (
                <div
                  key={jobId}
                  onClick={() => setSelectedJob(job)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer select-none relative ${
                    isSelected
                      ? "bg-blue-50/70 dark:bg-slate-800/90 border-[#1877f2] shadow-xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200/80 dark:border-slate-700"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                          {job.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(jobId);
                          }}
                          className={`p-1 rounded-md transition cursor-pointer ${
                            isSaved
                              ? "text-[#1877f2]"
                              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          }`}
                          title={isSaved ? "Saved" : "Save job"}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate mt-0.5">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </span>
                        {job.isRemote && (
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                            Remote
                          </span>
                        )}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {job.salary}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {job.type}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {job.experience}
                        </span>
                        {job.applicants?.length > 0 && (
                          <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{job.applicants.length} applied</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Full Job Details Preview (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedJob ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 sticky top-20">
                {/* Job Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={selectedJob.companyLogo}
                      alt={selectedJob.company}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedJob.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                        {selectedJob.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{selectedJob.location}</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{selectedJob.salary}</span>
                        </span>
                        <span className="bg-blue-50 dark:bg-[#1877f2]/10 text-[#1877f2] font-semibold px-2 py-0.5 rounded-full text-[11px]">
                          {selectedJob.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Poster Actions if Recruiter */}
                  {(selectedJob.poster?.id === currentUser?.id || activeTab === "manage") && (
                    <button
                      onClick={() => handleDeleteJob(selectedJob._id || selectedJob.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
                      title="Delete posting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Primary Actions (Apply & Save) */}
                <div className="flex items-center gap-3">
                  {hasAppliedToSelected ? (
                    <button
                      disabled
                      className="flex-1 py-2.5 px-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Application Submitted</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="flex-1 py-2.5 px-4 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply Now</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleSaveJob(selectedJob._id || selectedJob.id)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition flex items-center gap-2 cursor-pointer ${
                      savedJobIds.includes(selectedJob._id || selectedJob.id)
                        ? "bg-[#1877f2]/10 text-[#1877f2] border-[#1877f2]"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedJobIds.includes(selectedJob._id || selectedJob.id) ? "fill-current" : ""
                      }`}
                    />
                    <span>
                      {savedJobIds.includes(selectedJob._id || selectedJob.id) ? "Saved" : "Save"}
                    </span>
                  </button>

                  {selectedJob.poster && (
                    <button
                      onClick={() => onOpenChatWithUser?.(selectedJob.poster)}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                      title="Message Recruiter"
                    >
                      Message Recruiter
                    </button>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    About the Role
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Key Requirements */}
                {selectedJob.requirements?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                      Key Qualifications
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#1877f2] font-bold mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills Tags */}
                {selectedJob.skills?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                      Skills & Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recruiter Details & Applicants (If Recruiter View) */}
                {selectedJob.poster && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={selectedJob.poster.avatar}
                        alt={selectedJob.poster.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Posted by {selectedJob.poster.name}
                        </p>
                        <p className="text-[10px] text-slate-400">Hiring Team</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      {selectedJob.applicants?.length || 0} applicants
                    </span>
                  </div>
                )}

                {/* Recruiter Management View: Applicants Table */}
                {activeTab === "manage" && selectedJob.applicants?.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Applicants ({selectedJob.applicants.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedJob.applicants.map((app, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {app.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-500">{app.email} · {app.phone || "No phone"}</p>
                          {app.coverNote && (
                            <p className="text-slate-600 dark:text-slate-300 italic text-[11px]">
                              &quot;{app.coverNote}&quot;
                            </p>
                          )}
                          {app.resumeUrl && (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#1877f2] hover:underline flex items-center gap-1 text-[11px] pt-1"
                            >
                              <span>View Resume</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Select a job from the list to view full specifications.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Post a Job (Recruiter) */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs select-none">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Post a New Job
                </h3>
              </div>
              <button
                onClick={() => setIsPostJobModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
              {postJobError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 font-medium">
                  {postJobError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Acme Corp"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $140,000 - $180,000 / yr"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={newJobExp}
                    onChange={(e) => setNewJobExp(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead / Exec">Lead / Exec</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={newJobIsRemote}
                      onChange={(e) => setNewJobIsRemote(e.target.checked)}
                      className="rounded accent-[#1877f2]"
                    />
                    <span>Remote Position</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Node.js, Next.js"
                  value={newJobSkills}
                  onChange={(e) => setNewJobSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the company, mission, role responsibilities..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Requirements (one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="3+ years in web development&#10;Strong expertise with React and state management&#10;Excellent communication skills"
                  value={newJobReqs}
                  onChange={(e) => setNewJobReqs(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="px-4 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-xl font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingJob ? "Publishing..." : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Apply to Job (Seeker) */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs select-none">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Apply to {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedJob.company}</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Application Submitted!
                </h4>
                <p className="text-xs text-slate-400">
                  Your application has been received by {selectedJob.company}. Good luck!
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplyToJob} className="p-4 sm:p-5 space-y-3.5 text-xs">
                {applyError && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 font-medium">
                    {applyError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resume Link or Portfolio URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/... or drive link"
                    value={applicantResume}
                    onChange={(e) => setApplicantResume(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Note to Hiring Team
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Why are you a great fit for this position?"
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApp}
                    className="px-4 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-xl font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingApp ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
