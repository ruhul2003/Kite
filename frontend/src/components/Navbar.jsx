"use client";

import { useState } from "react";
import {
  Search,
  Sparkles,
  Zap,
  Radio,
  Volume2,
  VolumeX,
  Compass,
  Tv,
  Store,
  Bookmark,
  Plus,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  UserPlus,
  LogIn,
  X,
  Shield,
  Layers,
  Leaf,
  Sliders,
  Check,
} from "lucide-react";
import { VIBE_STATUSES } from "../data/mockData";

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  unreadNotifsCount,
  onOpenNotifications,
  isNotifsOpen,
  onToggleMessenger,
  isMessengerOpen,
  onOpenCreatePost,
  onOpenProfile,
  onOpenAuth,
  onLogout,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
  zenMode,
  setZenMode,
  ambientTrack,
  isAmbientPlaying,
  onToggleAmbient,
  currentVibe,
  setCurrentVibe,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVibeMenuOpen, setIsVibeMenuOpen] = useState(false);
  const [hideGuestBanner, setHideGuestBanner] = useState(false);

  return (
    <>


      {/* Main Top Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-[#0b0f19]/85 border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 h-16 flex items-center justify-between select-none transition-colors duration-200">
        {/* Left: Modern Kite Prism Emblem & Search */}
        <div className="flex items-center gap-3 min-w-[200px] lg:min-w-[280px]">
          <button
            onClick={() => setActiveTab("feed")}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            {/* Primary Kite Brand Emblem */}
            <div className="w-9 h-9 rounded-xl bg-[#1877f2] flex items-center justify-center text-white shadow-sm transition hover:bg-[#166fe5]">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L21 9L12 22L3 9L12 2Z" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M12 2L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 9L21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex flex-col text-left">
              <span className="font-bold text-2xl tracking-tight text-[#1877f2]">
                kite
              </span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-[240px] hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Kite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100/90 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-full border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Center: Modern Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === "feed"
                ? "bg-white dark:bg-slate-700 text-[#1877f2] shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Feed</span>
          </button>

          <button
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === "friends"
                ? "bg-white dark:bg-slate-700 text-[#1877f2] shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Friends</span>
          </button>

          <button
            onClick={() => setActiveTab("watch")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === "watch"
                ? "bg-white dark:bg-slate-700 text-[#1877f2] shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Watch</span>
          </button>

          <button
            onClick={() => setActiveTab("marketplace")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === "marketplace"
                ? "bg-white dark:bg-slate-700 text-[#1877f2] shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Marketplace</span>
          </button>
        </nav>

        {/* Right Section: Post Button, Messages, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Create Post Button */}
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-full text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Post</span>
          </button>

          {/* Messages Button */}
          <button
            onClick={onToggleMessenger}
            className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 transition"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1877f2] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0b0f19]">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1877f2] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0b0f19]">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition cursor-pointer"
            >
              <div className="relative">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0b0f19]"></span>
              </div>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-11 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setIsUserMenuOpen(false)}
              >
                {/* Profile Brief */}
                <div
                  onClick={onOpenProfile}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition mb-1"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {currentUser?.name}
                    </p>
                    <p className="text-[11px] text-indigo-500 font-medium truncate">
                      {currentUser?.isGuest ? "Guest Access" : "View Sanctuary"}
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1"></div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const next = !darkMode;
                    setDarkMode(next);
                    localStorage.setItem("kite_theme", next ? "dark" : "light");
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2.5">
                    {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                    <span>{darkMode ? "Light Sanctuary" : "Dark Canvas"}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {darkMode ? "Light" : "Dark"}
                  </span>
                </button>

                {/* Zen Mode toggle in menu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZenMode(!zenMode);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    <span>Zen Mode</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${zenMode ? "bg-emerald-500/20 text-emerald-500" : "text-slate-400"}`}>
                    {zenMode ? "ACTIVE" : "OFF"}
                  </span>
                </button>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1"></div>

                {currentUser?.isGuest ? (
                  <button
                    onClick={() => onOpenAuth("signup")}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Full Account</span>
                  </button>
                ) : (
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
