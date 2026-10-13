"use client";

import { useState } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Zap,
  TrendingUp,
  MessageSquare,
  Check,
  X,
  Radio,
  ExternalLink,
} from "lucide-react";
import { SOUNDSCAPE_TRACKS, DAILY_SPARK_PROMPT } from "../data/mockData";

export default function RightSidebar({
  friends,
  friendRequests,
  onAcceptRequest,
  onDeclineRequest,
  onOpenChatWithFriend,
  isAmbientPlaying,
  onToggleAmbient,
  ambientTrack,
  onSelectAmbientTrack,
  ambientVolume,
  onChangeAmbientVolume,
  onOpenCreatePost,
}) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const TRENDING_TOPICS = [
    { tag: "#webdevelopment", posts: "1.4k posts", category: "Technology" },
    { tag: "#productdesign", posts: "980 posts", category: "Design" },
    { tag: "#reactjs", posts: "720 posts", category: "Frameworks" },
    { tag: "#career", posts: "430 posts", category: "Community" },
  ];

  return (
    <aside className="w-[300px] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4 hidden lg:block select-none scrollbar-thin">

      {/* Incoming Connection Requests */}
      {friendRequests && friendRequests.length > 0 && (
        <div className="mb-4 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Friend Requests ({friendRequests.length})
            </p>
          </div>

          <div className="space-y-2.5">
            {friendRequests.map((req) => (
              <div key={req.id} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={req.avatar}
                    alt={req.name}
                    className="w-9 h-9 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {req.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {req.mutualFriends} mutual friends
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onAcceptRequest(req)}
                    className="py-1 px-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-[11px] font-semibold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    Confirm
                  </button>
                  <button
                    onClick={() => onDeclineRequest(req.id)}
                    className="py-1 px-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Topics */}
      <div className="mb-4 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 mb-2.5 text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-[#1877f2]" />
          <p className="text-[10px] font-bold uppercase tracking-wider">
            Trending Topics
          </p>
        </div>

        <div className="space-y-2">
          {TRENDING_TOPICS.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer group"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#1877f2] transition">
                  {item.tag}
                </p>
                <p className="text-[10px] text-slate-400">{item.category}</p>
              </div>
              <span className="text-[10px] font-mono font-medium text-slate-400">
                {item.posts}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Contacts */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Contacts
          </p>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        <div className="space-y-1">
          {friends.slice(0, 6).map((friend) => (
            <button
              key={friend.id}
              onClick={() => onOpenChatWithFriend(friend)}
              className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  {friend.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#1877f2] transition">
                    {friend.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {friend.online ? "Online" : friend.lastSeen || "Offline"}
                  </p>
                </div>
              </div>

              <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#1877f2] transition">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
