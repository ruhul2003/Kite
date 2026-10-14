"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  StickyNote,
} from "lucide-react";

export default function NotesView({
  currentUser,
  notes = [],
  onOpenCreatePost,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  return (
    <div className="w-full max-w-4xl mx-auto pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-[#1877f2]/10 to-purple-500/10 dark:from-indigo-500/20 dark:via-[#1877f2]/20 dark:to-purple-500/20 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1877f2]/10 text-[#1877f2] dark:text-[#60a5fa] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Knowledge & Scratchpad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Notes & Ideas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
              Capture quick thoughts, manage checklists, store code snippets, or convert notes into Kite feed posts anytime.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#1877f2] text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#1877f2] text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes, checklists, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1877f2] shadow-2xs backdrop-blur-sm transition"
          />
        </div>
      </div>
    </div>
  );
}
