"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart, ThumbsUp, Smile, Send } from "lucide-react";

export default function StoryViewerModal({ story, stories, onClose, onSelectStory, onReply }) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");

  const currentIndex = stories.findIndex((s) => s.id === story.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < stories.length - 1;

  const goToNext = () => {
    if (hasNext) {
      onSelectStory(stories[currentIndex + 1]);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrev = () => {
    if (hasPrev) {
      onSelectStory(stories[currentIndex - 1]);
      setProgress(0);
    }
  };

  useEffect(() => {
    setProgress(0);
  }, [story.id]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, story.id, currentIndex]);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(story.authorName, replyText);
    setReplyText("");
  };

  const handleReaction = (emoji) => {
    onReply(story.authorName, `Reacted ${emoji} to your story`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none backdrop-blur-md">
      {/* Top Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Story Arrow */}
      {hasPrev && (
        <button
          onClick={goToPrev}
          className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center transition"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      {/* Main Story Container */}
      <div
        className="relative w-full max-w-md h-[90vh] max-h-[820px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between bg-zinc-900 border border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Image */}
        <img
          src={story.storyMedia}
          alt={story.authorName}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top Gradient for Header */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

        {/* Progress Bar & Author Header */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Author Details */}
          <div className="flex items-center gap-3">
            <img
              src={story.authorAvatar}
              alt={story.authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1877f2]"
            />
            <div className="flex-1 min-w-0 text-white">
              <p className="text-sm font-bold truncate drop-shadow">{story.authorName}</p>
              <p className="text-[11px] text-white/70 drop-shadow">{story.timestamp || "Active now"}</p>
            </div>
          </div>
        </div>

        {/* Center / Bottom Caption & Reply Bar */}
        <div className="relative z-10 p-4 space-y-3">
          {story.caption && (
            <p className="text-white text-sm font-medium drop-shadow-lg bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              {story.caption}
            </p>
          )}

          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-center gap-4 text-2xl py-1">
            <button onClick={() => handleReaction("👍")} className="hover:scale-125 transition drop-shadow">👍</button>
            <button onClick={() => handleReaction("❤️")} className="hover:scale-125 transition drop-shadow">❤️</button>
            <button onClick={() => handleReaction("😂")} className="hover:scale-125 transition drop-shadow">😂</button>
            <button onClick={() => handleReaction("😮")} className="hover:scale-125 transition drop-shadow">😮</button>
            <button onClick={() => handleReaction("🔥")} className="hover:scale-125 transition drop-shadow">🔥</button>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Reply to ${story.authorName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 text-sm border border-white/20 focus:outline-none focus:bg-white/30 transition"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="w-10 h-10 rounded-full bg-[#1877f2] hover:bg-[#166fe5] disabled:opacity-40 text-white flex items-center justify-center transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Next Story Arrow */}
      {hasNext && (
        <button
          onClick={goToNext}
          className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center transition"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}
