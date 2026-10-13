"use client";

import { useState } from "react";
import { Play, ThumbsUp, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { INITIAL_WATCH } from "../data/mockData";

export default function WatchView() {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [likedVideos, setLikedVideos] = useState({});

  const toggleLike = (id) => {
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-5">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Watch</h2>
          <p className="text-xs text-slate-500">Trending video reels and creators</p>
        </div>
      </div>

      <div className="space-y-5">
        {INITIAL_WATCH.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Channel Info */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-sm">
                  {video.channel[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {video.channel}
                  </p>
                  <p className="text-xs text-slate-400">
                    {video.timestamp} · {video.views}
                  </p>
                </div>
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Video Title */}
            <p className="px-4 pb-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">
              {video.title}
            </p>

            {/* Video Thumbnail / Player */}
            <div
              className="relative aspect-video bg-black cursor-pointer group overflow-hidden"
              onClick={() => setPlayingVideoId(video.id)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                <div className="w-14 h-14 rounded-full bg-white/90 text-[#1877f2] flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 text-white text-xs font-semibold rounded-md">
                {video.duration}
              </span>
            </div>

            {/* Interaction Bar */}
            <div className="grid grid-cols-3 gap-1 p-1 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
              <button
                onClick={() => toggleLike(video.id)}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl transition cursor-pointer ${
                  likedVideos[video.id]
                    ? "text-[#1877f2]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{likedVideos[video.id] ? "Liked" : "Like"}</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400 cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button
                onClick={() => alert("Video link copied!")}
                className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

