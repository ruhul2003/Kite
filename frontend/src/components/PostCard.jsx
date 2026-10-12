"use client";

import { useState, useRef } from "react";
import {
  MoreHorizontal,
  Bookmark,
  Share2,
  MessageSquare,
  Link,
  Trash2,
  Globe,
  Users,
  Lock,
  Play,
  Pause,
  Copy,
  Check,
  Send,
  Sparkles,
  Zap,
  Radio,
  FileCode,
  BarChart2,
  Leaf,
  Mic,
} from "lucide-react";
import { KITE_REACTIONS } from "../data/mockData";

export default function PostCard({
  post,
  currentUser,
  onReact,
  onAddComment,
  onToggleSave,
  onDeletePost,
  onShare,
  onImageClick,
  zenMode,
  onVotePoll,
}) {
  const [showReactionsDock, setShowReactionsDock] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(post.comments?.length > 0);
  const [newComment, setNewComment] = useState("");
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  // Audio Player State for Voice Sparks
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioIntervalRef = useRef(null);

  // Interactive Poll Local State
  const [pollState, setPollState] = useState(post.poll);

  const dockTimeoutRef = useRef(null);

  const totalReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
  const currentReactionObj = KITE_REACTIONS.find((r) => r.id === post.userReaction);

  const handleMouseEnterReact = () => {
    dockTimeoutRef.current = setTimeout(() => {
      setShowReactionsDock(true);
    }, 180);
  };

  const handleMouseLeaveReact = () => {
    if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
    setShowReactionsDock(false);
  };

  const handleReactionClick = (reactionId) => {
    onReact(post.id, reactionId);
    setShowReactionsDock(false);
  };

  // Simulated Voice Spark Audio Player
  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      clearInterval(audioIntervalRef.current);
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            clearInterval(audioIntervalRef.current);
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 3;
        });
      }, 300);
    }
  };

  const handleCopyCode = () => {
    if (post.codeSnippet?.code) {
      navigator.clipboard.writeText(post.codeSnippet.code);
      setIsCopiedCode(true);
      setTimeout(() => setIsCopiedCode(false), 2000);
    }
  };

  // Poll Vote Handler
  const handleVote = (optionId) => {
    if (!pollState) return;
    const prevOptionId = pollState.userVotedOptionId;
    if (prevOptionId === optionId) return;

    const updatedOptions = pollState.options.map((opt) => {
      let v = opt.votes;
      if (opt.id === prevOptionId && v > 0) v -= 1;
      if (opt.id === optionId) v += 1;
      return { ...opt, votes: v };
    });

    const totalVotes = updatedOptions.reduce((acc, curr) => acc + curr.votes, 0);
    const withPercentages = updatedOptions.map((opt) => ({
      ...opt,
      percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
    }));

    setPollState({
      ...pollState,
      totalVotes,
      userVotedOptionId: optionId,
      options: withPercentages,
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(post.id, {
      id: `c-${Date.now()}`,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      content: newComment.trim(),
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    });

    setNewComment("");
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 mb-4 overflow-hidden transition duration-200 select-none">
      {/* Spark Header */}
      <div className="flex items-center justify-between p-4 pb-2.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={post.author?.avatar}
              alt={post.author?.name}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            {post.author?.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white dark:ring-slate-900">
                ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-cyan-400 cursor-pointer transition">
                {post.author?.name}
              </span>

              {post.author?.role && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {post.author.role}
                </span>
              )}

              {post.author?.vibe && (
                <span className="text-[10px] font-bold text-indigo-500 dark:text-cyan-400">
                  • {post.author.vibe}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
              <span>{post.timestamp}</span>
              <span>•</span>
              {post.privacy === "public" ? (
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Public Sanctuary</span>
              ) : post.privacy === "friends" ? (
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Circle</span>
              ) : (
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Private</span>
              )}

              {post.vibeTag && (
                <>
                  <span>•</span>
                  <span className="text-[10px] uppercase font-bold text-indigo-500 dark:text-cyan-400">
                    #{post.vibeTag}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Menu (3 dots) */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-9 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-30 animate-in fade-in"
              onClick={() => setShowMenu(false)}
            >
              <button
                onClick={() => onToggleSave(post.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <Bookmark className="w-4 h-4 text-purple-500" />
                <span>{post.isSaved ? "Remove from Stash" : "Save to Stash"}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Spark URL copied!");
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <Link className="w-4 h-4 text-cyan-500" />
                <span>Copy Spark Link</span>
              </button>

              {post.author?.id === currentUser?.id && (
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Spark</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Text Content or Vibrant Gradient Box */}
      {post.bgGradient ? (
        <div className={`w-full p-8 font-bold text-center text-xl sm:text-2xl text-white flex items-center justify-center min-h-[200px] ${post.bgGradient}`}>
          <p className="max-w-md drop-shadow-md leading-relaxed">{post.content}</p>
        </div>
      ) : (
        post.content && (
          <div className="px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        )
      )}

      {/* FEATURE: VOICE SPARK AUDIO WAVEFORM PLAYER */}
      {post.audioSpark && (
        <div className="mx-4 my-2.5 p-3.5 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-indigo-500/10 border border-rose-500/25 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayAudio}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md transition transform hover:scale-105 ${
                  isPlayingAudio ? "bg-rose-600" : "bg-gradient-to-r from-rose-500 to-indigo-600"
                }`}
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
              </button>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {post.audioSpark.title}
                </p>
                <p className="text-[10px] text-slate-400">
                  🎙️ Voice Spark • {post.audioSpark.duration}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
              {isPlayingAudio ? "Listening..." : "Tap to Play"}
            </span>
          </div>

          {/* Interactive Bouncing Waveform Bars */}
          <div className="flex items-center gap-1 h-8 px-1">
            {(post.audioSpark.waves || [30, 45, 60, 80, 50, 70, 90, 85, 60, 40, 75, 90, 65, 45, 55, 70, 40, 20]).map(
              (h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-200 ${
                    isPlayingAudio ? "bg-rose-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  style={{
                    height: isPlayingAudio ? `${Math.max(6, (h * (0.4 + Math.random() * 0.6)) / 3)}px` : `${h / 4}px`,
                  }}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* FEATURE: INTERACTIVE SYNTAX-HIGHLIGHTED CODE BLOCK */}
      {post.codeSnippet && (
        <div className="mx-4 my-2.5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
          {/* macOS style code window header */}
          <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="font-mono text-[11px] text-slate-300 font-medium">
                {post.codeSnippet.filename}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                {post.codeSnippet.language}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition px-2 py-0.5 rounded bg-slate-800/80"
                title="Copy code"
              >
                {isCopiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Formatted Code with line numbers */}
          <div className="p-3 font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed max-h-72 scrollbar-thin">
            <pre className="text-cyan-300">
              <code>{post.codeSnippet.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* FEATURE: INTERACTIVE VIBE POLL */}
      {pollState && (
        <div className="mx-4 my-2.5 p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              <span>{pollState.question}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {pollState.totalVotes} votes
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {pollState.options.map((option) => {
              const isSelected = pollState.userVotedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  className={`w-full relative overflow-hidden p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10 font-bold text-indigo-600 dark:text-cyan-400"
                      : "border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                  }`}
                >
                  {/* Animated percentage background fill */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-indigo-500/15 dark:bg-indigo-500/25 transition-all duration-500"
                    style={{ width: `${option.percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center gap-2">
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                    <span>{option.text}</span>
                  </div>

                  <span className="relative z-10 font-mono text-[11px] font-bold text-slate-400">
                    {option.percentage}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Post Images / Media */}
      {post.media && post.media.length > 0 && (
        <div className="mt-2 relative bg-slate-100 dark:bg-slate-950 cursor-pointer overflow-hidden">
          <img
            src={post.media[0].url}
            alt={post.media[0].caption || "Media preview"}
            onClick={() => onImageClick?.(post.media[0].url)}
            className="w-full max-h-[500px] object-cover hover:opacity-95 transition"
          />
        </div>
      )}

      {/* Engagement Stats Bar (Honors Zen Mode!) */}
      <div className="px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 cursor-pointer">
          {totalReactions > 0 && (
            <div className="flex -space-x-1 items-center">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-slate-900">
                ⚡
              </span>
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-slate-900">
                💡
              </span>
              <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-slate-900">
                💜
              </span>
            </div>
          )}

          {/* ZEN MODE: Soften vanity metrics! */}
          {zenMode ? (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              <span>Resonating in the Circle</span>
            </span>
          ) : (
            <span>{totalReactions} sparks</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer"
          >
            {zenMode ? "Discussion" : `${post.comments?.length || 0} reflections`}
          </button>
          {!zenMode && <span>{post.sharesCount || 0} echoes</span>}
        </div>
      </div>

      {/* Kite Action Buttons (Spark Reactions, Reply, Echo) */}
      <div className="relative px-3 py-1.5 grid grid-cols-3 gap-1">
        {/* Spark Reaction Button with Hover Dock */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnterReact}
          onMouseLeave={handleMouseLeaveReact}
        >
          {showReactionsDock && (
            <div className="absolute -top-12 left-0 z-40 bg-white dark:bg-slate-850 shadow-2xl rounded-full border border-slate-200 dark:border-slate-700 px-2 py-1 flex items-center gap-2 spark-dock-anim">
              {KITE_REACTIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleReactionClick(r.id)}
                  className="text-xl transform hover:scale-130 transition duration-150 p-1 hover:-translate-y-1"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => handleReactionClick(post.userReaction ? null : "spark")}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold ${
              currentReactionObj ? `${currentReactionObj.color} font-bold` : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {currentReactionObj ? (
              <>
                <span className="text-base">{currentReactionObj.emoji}</span>
                <span>{currentReactionObj.label}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Spark</span>
              </>
            )}
          </button>
        </div>

        {/* Comment / Reply Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400 text-xs font-semibold"
        >
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          <span>Reflect</span>
        </button>

        {/* Share / Echo Button */}
        <button
          onClick={() => onShare(post.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400 text-xs font-semibold"
        >
          <Share2 className="w-4 h-4 text-cyan-500" />
          <span>Echo</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
          {/* Comments List */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-2.5 items-start">
                <img
                  src={comment.author?.avatar}
                  alt={comment.author?.name}
                  className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <div className="bg-white dark:bg-slate-850 px-3.5 py-2 rounded-2xl inline-block max-w-[90%] border border-slate-200/60 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {comment.author?.name}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-2 mt-1 text-[10px] text-slate-400 font-semibold">
                    <button className="hover:underline">⚡ Resonate</button>
                    <button className="hover:underline">Reply</button>
                    <span>{comment.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Composer Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 flex items-center bg-white dark:bg-slate-850 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 transition">
              <input
                type="text"
                placeholder={`Share a reflection as ${currentUser?.name?.split(" ")[0]}...`}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="p-1 text-indigo-600 dark:text-cyan-400 disabled:opacity-30 hover:scale-110 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
