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
    { tag: "#buildinpublic", sparks: "1.4k sparks", category: "Craft & Code" },
    { tag: "#generativeAI", sparks: "980 sparks", category: "Technology" },
    { tag: "#mindfultech", sparks: "720 sparks", category: "Well-being" },
    { tag: "#audiosparks", sparks: "430 sparks", category: "Voice" },
  ];

  return (
    <aside className="w-[300px] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4 hidden lg:block select-none scrollbar-thin">
      {/* FEATURE: BUILT-IN AMBIENT SOUNDSCAPE PLAYER */}
      <div className="mb-4 p-3.5 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/40 backdrop-blur-md rounded-2xl border border-indigo-500/30 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-cyan-400 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>Kite Soundscape</span>
                {isAmbientPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </h4>
              <p className="text-[10px] text-slate-400">Audio sanctuary for focus</p>
            </div>
          </div>

          <button
            onClick={onToggleAmbient}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
              isAmbientPlaying
                ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
            title={isAmbientPlaying ? "Pause Soundscape" : "Play Soundscape"}
          >
            {isAmbientPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>

        {/* Track Selection Chips */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          {SOUNDSCAPE_TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => onSelectAmbientTrack(track)}
              className={`p-2 rounded-xl text-left transition flex items-center gap-2 text-xs border ${
                ambientTrack?.id === track.id
                  ? "bg-indigo-500/30 border-cyan-400/60 text-white font-bold"
                  : "bg-slate-800/40 hover:bg-slate-800/70 border-white/5 text-slate-300"
              }`}
            >
              <span className="text-sm">{track.icon}</span>
              <span className="truncate text-[11px]">{track.name}</span>
            </button>
          ))}
        </div>

        {/* Volume Slider & Animated Visualizer */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-[11px]">
            {isAmbientPlaying ? (
              <div className="flex items-center gap-1 h-3 text-cyan-400">
                <span className="w-1 bg-cyan-400 rounded-full wave-bar-1"></span>
                <span className="w-1 bg-cyan-400 rounded-full wave-bar-2"></span>
                <span className="w-1 bg-cyan-400 rounded-full wave-bar-3"></span>
                <span className="w-1 bg-cyan-400 rounded-full wave-bar-4"></span>
                <span className="ml-1 text-[10px] text-cyan-300 font-mono">Playing</span>
              </div>
            ) : (
              <span>Tap play to listen</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3 h-3 text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => onChangeAmbientVolume(parseFloat(e.target.value))}
              className="w-16 accent-cyan-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* FEATURE: DAILY COMMUNITY SPARK */}
      <div className="mb-4 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-cyan-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Daily Spark</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {DAILY_SPARK_PROMPT.sparksCount} replies
          </span>
        </div>

        <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2.5">
          &ldquo;{DAILY_SPARK_PROMPT.question}&rdquo;
        </h5>

        <button
          onClick={onOpenCreatePost}
          className="w-full py-1.5 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Drop your Spark</span>
        </button>
      </div>

      {/* Incoming Connection Requests */}
      {friendRequests && friendRequests.length > 0 && (
        <div className="mb-4 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Connection Sparks ({friendRequests.length})
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
                      {req.mutualFriends} shared connections
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onAcceptRequest(req)}
                    className="py-1 px-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Accept
                  </button>
                  <button
                    onClick={() => onDeclineRequest(req.id)}
                    className="py-1 px-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Vibe Topics */}
      <div className="mb-4 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2.5 text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider">
            Trending in the Circle
          </p>
        </div>

        <div className="space-y-2">
          {TRENDING_TOPICS.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer group"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition">
                  {item.tag}
                </p>
                <p className="text-[10px] text-slate-400">{item.category}</p>
              </div>
              <span className="text-[10px] font-mono font-medium text-slate-400">
                {item.sparks}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Circle Members / Whisper Launcher */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Circle Network
          </p>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        <div className="space-y-1">
          {friends.slice(0, 5).map((friend) => (
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
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition">
                    {friend.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {friend.online ? "Active now" : friend.lastSeen || "Offline"}
                  </p>
                </div>
              </div>

              <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
