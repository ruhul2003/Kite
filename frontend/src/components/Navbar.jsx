"use client";

import { useState } from "react";
import {
  Search,
  Home,
  Users,
  Tv,
  Store,
  Compass,
  Bookmark,
  Plus,
  MessageCircle,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  UserPlus,
  LogIn,
  Sparkles,
  X,
  Settings,
} from "lucide-react";

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
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [hideGuestBanner, setHideGuestBanner] = useState(false);

  return (
    <>
      {/* Optional Guest Announcement Bar */}
      {currentUser?.isGuest && !hideGuestBanner && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-xs font-medium px-4 py-1.5 flex items-center justify-between shadow-sm transition">
          <div className="flex items-center gap-2 mx-auto truncate">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Guest Mode
            </span>
            <span className="truncate">
              You are exploring Kite as a guest! All features (posts, reactions, comments, chat) are unlocked.
            </span>
            <button
              onClick={() => onOpenAuth("signup")}
              className="underline font-bold hover:text-amber-100 shrink-0 ml-1"
            >
              Sign up for a permanent account →
            </button>
          </div>
          <button
            onClick={() => setHideGuestBanner(true)}
            className="p-1 hover:bg-white/20 rounded-full transition ml-2 shrink-0"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#242526] border-b border-zinc-200 dark:border-zinc-700/60 shadow-[0_2px_4px_rgba(0,0,0,0.04)] px-4 h-14 flex items-center justify-between select-none">
        {/* Left Section: Logo & Search */}
        <div className="flex items-center gap-2.5 min-w-[200px] lg:min-w-[280px]">
          {/* Facebook-style Kite Logo */}
          <button
            onClick={() => setActiveTab("feed")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#1877f2] group-hover:bg-[#166fe5] flex items-center justify-center text-white font-black text-2xl tracking-tighter shadow-sm transition transform group-hover:scale-105">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L20 10L12 22L4 10L12 2Z" />
                <path d="M4 10L20 10" />
                <path d="M12 2L12 22" />
              </svg>
            </div>
            <span className="hidden sm:inline font-black text-2xl tracking-tight text-[#1877f2]">
              kite
            </span>
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search Kite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-zinc-100 dark:bg-[#3a3b3c] text-zinc-900 dark:text-[#e4e6eb] placeholder-zinc-500 rounded-full border border-transparent focus:outline-none focus:border-[#1877f2] focus:bg-white dark:focus:bg-[#242526] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Center Section: Primary Navigation Tabs */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl h-full px-2">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab("feed")}
            title="Home"
            className={`flex-1 h-full flex items-center justify-center relative transition rounded-lg hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] ${
              activeTab === "feed" ? "text-[#1877f2]" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Home className="w-7 h-7" />
            {activeTab === "feed" && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />
            )}
          </button>

          {/* Friends Tab */}
          <button
            onClick={() => setActiveTab("friends")}
            title="Friends"
            className={`flex-1 h-full flex items-center justify-center relative transition rounded-lg hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] ${
              activeTab === "friends" ? "text-[#1877f2]" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <div className="relative">
              <Users className="w-7 h-7" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                3
              </span>
            </div>
            {activeTab === "friends" && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />
            )}
          </button>

          {/* Watch Tab */}
          <button
            onClick={() => setActiveTab("watch")}
            title="Watch"
            className={`flex-1 h-full flex items-center justify-center relative transition rounded-lg hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] ${
              activeTab === "watch" ? "text-[#1877f2]" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Tv className="w-7 h-7" />
            {activeTab === "watch" && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />
            )}
          </button>

          {/* Marketplace Tab */}
          <button
            onClick={() => setActiveTab("marketplace")}
            title="Marketplace"
            className={`flex-1 h-full flex items-center justify-center relative transition rounded-lg hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] ${
              activeTab === "marketplace" ? "text-[#1877f2]" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Store className="w-7 h-7" />
            {activeTab === "marketplace" && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />
            )}
          </button>

          {/* Saved Posts Tab */}
          <button
            onClick={() => setActiveTab("saved")}
            title="Saved Posts"
            className={`flex-1 h-full flex items-center justify-center relative transition rounded-lg hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] ${
              activeTab === "saved" ? "text-[#1877f2]" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Bookmark className="w-7 h-7" />
            {activeTab === "saved" && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Right Section: Action Icons & Profile */}
        <div className="flex items-center gap-2 min-w-[200px] justify-end">
          {/* Quick Create Button */}
          <div className="relative">
            <button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-[#3a3b3c] hover:bg-zinc-200 dark:hover:bg-[#4e4f50] text-zinc-800 dark:text-[#e4e6eb] flex items-center justify-center transition"
              title="Create"
            >
              <Plus className="w-5 h-5" />
            </button>

            {isCreateMenuOpen && (
              <div 
                className="absolute right-0 top-12 w-56 bg-white dark:bg-[#242526] rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsCreateMenuOpen(false)}
              >
                <div className="p-2 border-b border-zinc-100 dark:border-zinc-700/60 mb-1">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">Create New</p>
                </div>
                <button
                  onClick={onOpenCreatePost}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-left text-xs font-semibold"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-[#1877f2] flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p>Post</p>
                    <p className="text-[10px] text-zinc-500 font-normal">Share on News Feed</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("feed");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-left text-xs font-semibold"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p>Story</p>
                    <p className="text-[10px] text-zinc-500 font-normal">Share a photo or thought</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Messenger Button */}
          <button
            onClick={onToggleMessenger}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition ${
              isMessengerOpen
                ? "bg-[#1877f2] text-white"
                : "bg-zinc-100 dark:bg-[#3a3b3c] hover:bg-zinc-200 dark:hover:bg-[#4e4f50] text-zinc-800 dark:text-[#e4e6eb]"
            }`}
            title="Messenger"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white dark:border-[#242526]">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition ${
              isNotifsOpen
                ? "bg-[#1877f2] text-white"
                : "bg-zinc-100 dark:bg-[#3a3b3c] hover:bg-zinc-200 dark:hover:bg-[#4e4f50] text-zinc-800 dark:text-[#e4e6eb]"
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white dark:border-[#242526]">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-[#3a3b3c] hover:bg-zinc-200 dark:hover:bg-[#4e4f50] text-zinc-800 dark:text-[#e4e6eb] flex items-center justify-center transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
          </button>

          {/* Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative rounded-full focus:outline-none p-0.5 hover:ring-2 hover:ring-[#1877f2] transition"
              title="Account Menu"
            >
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              {currentUser?.isGuest ? (
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1 rounded-full uppercase">
                  G
                </span>
              ) : (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#242526]" />
              )}
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-12 w-72 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsUserMenuOpen(false)}
              >
                {/* User Info Card */}
                <div
                  onClick={onOpenProfile}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition cursor-pointer border border-zinc-100 dark:border-zinc-700/60 shadow-sm"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {currentUser?.isGuest ? "Guest Profile" : `@${currentUser?.username}`}
                    </p>
                  </div>
                  {currentUser?.isGuest && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">
                      Guest
                    </span>
                  )}
                </div>

                <div className="my-2 border-t border-zinc-100 dark:border-zinc-700/60" />

                <div className="space-y-1">
                  <button
                    onClick={onOpenProfile}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-left text-xs font-semibold text-zinc-700 dark:text-zinc-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#3a3b3c] flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span>View Profile</span>
                  </button>

                  {currentUser?.isGuest ? (
                    <button
                      onClick={() => onOpenAuth("signup")}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-left text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <span>Sign Up Permanent Account</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenAuth("login")}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-left text-xs font-semibold text-zinc-700 dark:text-zinc-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#3a3b3c] flex items-center justify-center">
                        <LogIn className="w-4 h-4" />
                      </div>
                      <span>Switch Account</span>
                    </button>
                  )}

                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-left text-xs font-semibold text-zinc-700 dark:text-zinc-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#3a3b3c] flex items-center justify-center">
                        {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                      </div>
                      <span>Display Mode</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">
                      {darkMode ? "Dark" : "Light"}
                    </span>
                  </button>

                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-700/60" />

                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition text-left text-xs font-semibold text-red-600 dark:text-red-400"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
