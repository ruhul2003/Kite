"use client";

import { useState } from "react";
import {
  Users,
  Tv,
  Store,
  Bookmark,
  Clock,
  Flag,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Compass,
  HeartHandshake,
} from "lucide-react";

export default function LeftSidebar({ currentUser, activeTab, setActiveTab, onOpenProfile, onOpenAuth }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <aside className="w-[280px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-2 py-3 hidden xl:block select-none scrollbar-thin">
      {/* User Profile item */}
      <button
        onClick={onOpenProfile}
        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] transition text-left group"
      >
        <div className="relative">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
          />
          {currentUser?.isGuest && (
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-black px-1 rounded-full uppercase">
              G
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-[#e4e6eb] truncate">
            {currentUser?.name}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            {currentUser?.isGuest ? "Guest Access" : "View your profile"}
          </p>
        </div>
      </button>

      {/* Main Nav Items */}
      <div className="mt-1 space-y-0.5">
        <button
          onClick={() => setActiveTab("friends")}
          className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl transition text-left text-sm font-medium ${
            activeTab === "friends"
              ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold"
              : "text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c]"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-[#1877f2] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span>Friends</span>
            <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.2">
              3 new
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("feed")}
          className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl transition text-left text-sm font-medium ${
            activeTab === "feed"
              ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold"
              : "text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c]"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Feeds (All Posts)</span>
        </button>

        <button
          onClick={() => setActiveTab("watch")}
          className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl transition text-left text-sm font-medium ${
            activeTab === "watch"
              ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold"
              : "text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c]"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Tv className="w-5 h-5" />
          </div>
          <span>Watch</span>
        </button>

        <button
          onClick={() => setActiveTab("marketplace")}
          className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl transition text-left text-sm font-medium ${
            activeTab === "marketplace"
              ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold"
              : "text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c]"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <span>Marketplace</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl transition text-left text-sm font-medium ${
            activeTab === "saved"
              ? "bg-[#1877f2]/10 text-[#1877f2] font-semibold"
              : "text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c]"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <span>Saved Posts</span>
        </button>

        <button
          onClick={() => setActiveTab("memories")}
          className="w-full flex items-center gap-3.5 p-2.5 rounded-xl transition text-left text-sm font-medium text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c]"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <span>Memories</span>
        </button>

        {showMore && (
          <div className="space-y-0.5 animate-in fade-in duration-200">
            <div className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-left text-sm font-medium text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <span>Pages</span>
            </div>

            <div className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-left text-sm font-medium text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span>Events</span>
            </div>

            <div className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-left text-sm font-medium text-zinc-800 dark:text-[#e4e6eb] hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span>Fundraisers</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center gap-3.5 p-2.5 rounded-xl text-left text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] transition"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-200/80 dark:bg-[#3a3b3c] flex items-center justify-center text-zinc-600 dark:text-zinc-300">
            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          <span>{showMore ? "See Less" : "See More"}</span>
        </button>
      </div>

      <div className="my-3 border-t border-zinc-200/80 dark:border-zinc-700/60" />

      {/* Shortcuts / Popular Groups */}
      <div>
        <p className="px-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
          Your Shortcuts
        </p>

        <div className="space-y-0.5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] cursor-pointer transition text-xs font-semibold text-zinc-800 dark:text-[#e4e6eb]">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80"
              alt="Tech"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="truncate">Tech Enthusiasts & Founders</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] cursor-pointer transition text-xs font-semibold text-zinc-800 dark:text-[#e4e6eb]">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&auto=format&fit=crop&q=80"
              alt="Photography"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="truncate">Landscape Photographers Club</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] cursor-pointer transition text-xs font-semibold text-zinc-800 dark:text-[#e4e6eb]">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80"
              alt="Healthy Foods"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="truncate">Meal Prep & Healthy Habits</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] cursor-pointer transition text-xs font-semibold text-zinc-800 dark:text-[#e4e6eb]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
            <span className="truncate">Kite Early Adopters</span>
          </div>
        </div>
      </div>

      {/* Guest encouragement CTA in sidebar if guest */}
      {currentUser?.isGuest && (
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 text-xs">
          <p className="font-bold text-amber-700 dark:text-amber-400">Enjoying Kite?</p>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5 leading-relaxed">
            Create a free profile to keep your posts, reactions, and friends forever.
          </p>
          <button
            onClick={() => onOpenAuth("signup")}
            className="mt-2 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] shadow-sm transition"
          >
            Create Permanent Account
          </button>
        </div>
      )}

      {/* Footer Links */}
      <div className="mt-6 px-2 text-[11px] text-zinc-400 dark:text-zinc-500 leading-normal space-y-1">
        <p>Privacy · Terms · Advertising · Ad Choices · Cookies · More</p>
        <p className="text-[10px]">Kite Social Platform © 2026</p>
      </div>
    </aside>
  );
}
