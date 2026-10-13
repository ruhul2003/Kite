"use client";

import { useState } from "react";
import {
  Zap,
  Mic,
  Code,
  Compass,
  Lightbulb,
  Bookmark,
  Users,
  Tv,
  Store,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Leaf,
  Layers,
  Flame,
  Radio,
  Palette,
} from "lucide-react";

export default function LeftSidebar({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenAuth,
  zenMode,
  selectedVibeFilter,
  setSelectedVibeFilter,
}) {
  const [showMore, setShowMore] = useState(false);

  const navigationItems = [
    {
      id: "feed",
      label: "News Feed",
      icon: Zap,
    },
    {
      id: "friends",
      label: "Friends",
      icon: Users,
      badge: "3",
      badgeColor: "bg-[#1877f2]/10 text-[#1877f2]",
    },
    {
      id: "saved",
      label: "Saved Posts",
      icon: Bookmark,
    },
    {
      id: "watch",
      label: "Watch Videos",
      icon: Tv,
    },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: Store,
    },
  ];

  const CIRCLE_COMMUNITIES = [
    { name: "⚡ Indie Creators", members: "1.4k members", icon: "🚀", color: "from-indigo-500 to-purple-600" },
    { name: "🎨 Generative Design", members: "980 members", icon: "✨", color: "from-pink-500 to-rose-600" },
    { name: "🌿 Mindful Tech", members: "2.1k members", icon: "🍵", color: "from-emerald-500 to-teal-600" },
    { name: "🤖 Machine Learning Lab", members: "3.2k members", icon: "💡", color: "from-cyan-500 to-blue-600" },
  ];

  return (
    <aside className="w-[270px] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4 hidden xl:block select-none scrollbar-thin">
      {/* User Sanctuary Card */}
      <button
        onClick={onOpenProfile}
        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800/80 shadow-sm transition group text-left cursor-pointer mb-3"
      >
        <div className="relative">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500/70 transition"
          />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition">
            {currentUser?.name}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
            <span>@{currentUser?.username || "creator"}</span>
            {currentUser?.isGuest && (
              <span className="bg-amber-500/20 text-amber-500 text-[8px] font-bold px-1 rounded">
                Guest
              </span>
            )}
          </p>
        </div>
      </button>

      {/* Primary Navigation Rail */}
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isItemActive =
            item.filterTag
              ? activeTab === "feed" && selectedVibeFilter === item.filterTag
              : activeTab === item.id && (!selectedVibeFilter || item.id !== "feed");

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.filterTag) {
                  setActiveTab("feed");
                  setSelectedVibeFilter?.(item.filterTag);
                } else {
                  setActiveTab(item.id);
                  if (item.id === "feed") {
                    setSelectedVibeFilter?.("all");
                  }
                }
              }}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left text-xs font-semibold cursor-pointer ${
                isItemActive
                  ? "bg-[#1877f2]/10 text-[#1877f2] font-bold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isItemActive
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#1877f2]/10 text-[#1877f2]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="h-[1px] bg-slate-200/70 dark:border-slate-800/80 my-3.5"></div>

      {/* Featured Circles / Spaces */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Circles
          </p>
          <span className="text-[10px] text-indigo-500 font-bold hover:underline cursor-pointer">
            Explore
          </span>
        </div>

        <div className="space-y-1">
          {CIRCLE_COMMUNITIES.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer group"
            >
              <div
                className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${c.color} flex items-center justify-center text-xs text-white shadow-sm shrink-0`}
              >
                {c.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition">
                  {c.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{c.members}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zen Mode Sanctuary Banner */}
      {zenMode && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span>Zen Sanctuary Active</span>
          </div>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
            Vanity numbers and metric counters are softened. Enjoy genuine ideas without algorithmic noise.
          </p>
        </div>
      )}
    </aside>
  );
}
