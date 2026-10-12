"use client";

import { useState, useRef } from "react";
import {
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  MessageCircle,
  Share2,
  Bookmark,
  Check,
  Trash2,
  Link,
  EyeOff,
  Send,
  Smile,
  ThumbsUp,
  Heart,
  SmilePlus,
} from "lucide-react";

const REACTIONS = [
  { id: "like", label: "Like", emoji: "👍", color: "text-[#1877f2]" },
  { id: "love", label: "Love", emoji: "❤️", color: "text-[#f02849]" },
  { id: "care", label: "Care", emoji: "🥰", color: "text-[#f7b125]" },
  { id: "haha", label: "Haha", emoji: "😂", color: "text-[#f7b125]" },
  { id: "wow", label: "Wow", emoji: "😮", color: "text-[#f7b125]" },
  { id: "sad", label: "Sad", emoji: "😢", color: "text-[#f7b125]" },
  { id: "angry", label: "Angry", emoji: "😡", color: "text-[#e44d26]" },
];

export default function PostCard({
  post,
  currentUser,
  onReact,
  onAddComment,
  onToggleSave,
  onDeletePost,
  onShare,
  onImageClick,
}) {
  const [showReactionsDock, setShowReactionsDock] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(post.comments?.length > 0);
  const [newComment, setNewComment] = useState("");
  const dockTimeoutRef = useRef(null);

  const totalReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);

  const currentReactionObj = REACTIONS.find((r) => r.id === post.userReaction);

  const handleMouseEnterLike = () => {
    dockTimeoutRef.current = setTimeout(() => {
      setShowReactionsDock(true);
    }, 200);
  };

  const handleMouseLeaveLike = () => {
    if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
    setShowReactionsDock(false);
  };

  const handleReactionClick = (reactionId) => {
    onReact(post.id, reactionId);
    setShowReactionsDock(false);
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
    <article className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/60 mb-4 overflow-hidden transition select-none">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3.5 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.avatar}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-zinc-900 dark:text-[#e4e6eb] hover:underline cursor-pointer">
                {post.author?.name}
              </span>
              {post.author?.isVerified && (
                <span className="w-4 h-4 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              )}
              {post.feeling && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  is {post.feeling.emoji} {post.feeling.text}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              <span>{post.timestamp}</span>
              <span>•</span>
              {post.privacy === "public" ? (
                <Globe className="w-3 h-3" />
              ) : post.privacy === "friends" ? (
                <Users className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
            </div>
          </div>
        </div>

        {/* 3 Dots Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-9 w-48 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700/80 p-1.5 z-30 animate-in fade-in"
              onClick={() => setShowMenu(false)}
            >
              <button
                onClick={() => onToggleSave(post.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              >
                <Bookmark className="w-4 h-4 text-purple-500" />
                <span>{post.isSaved ? "Unsave post" : "Save post"}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Post link copied to clipboard!");
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              >
                <Link className="w-4 h-4 text-blue-500" />
                <span>Copy link</span>
              </button>

              {post.author?.id === currentUser?.id && (
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content or Colorful Gradient */}
      {post.bgGradient ? (
        <div
          className={`w-full p-8 font-bold text-center text-xl sm:text-2xl text-white flex items-center justify-center min-h-[200px] ${post.bgGradient}`}
        >
          <p className="max-w-md drop-shadow-md leading-relaxed">{post.content}</p>
        </div>
      ) : (
        post.content && (
          <div className="px-4 py-2 text-sm sm:text-base text-zinc-900 dark:text-[#e4e6eb] whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        )
      )}

      {/* Post Media (Images) */}
      {post.media && post.media.length > 0 && (
        <div className="mt-2 relative bg-zinc-100 dark:bg-zinc-900 cursor-pointer overflow-hidden">
          <img
            src={post.media[0].url}
            alt={post.media[0].caption || "Post media"}
            onClick={() => onImageClick?.(post.media[0].url)}
            className="w-full max-h-[540px] object-cover hover:opacity-95 transition"
          />
        </div>
      )}

      {/* Engagement Stats Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-700/60">
        <div className="flex items-center gap-1.5 cursor-pointer">
          {totalReactions > 0 && (
            <div className="flex -space-x-1 items-center">
              <span className="w-5 h-5 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-[#242526]">
                👍
              </span>
              <span className="w-5 h-5 rounded-full bg-[#f02849] text-white flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-[#242526]">
                ❤️
              </span>
              <span className="w-5 h-5 rounded-full bg-[#f7b125] text-white flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-[#242526]">
                😂
              </span>
            </div>
          )}
          <span>{totalReactions}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer"
          >
            {post.comments?.length || 0} comments
          </button>
          <span>{post.sharesCount || 0} shares</span>
        </div>
      </div>

      {/* Facebook 3 Action Buttons (Like, Comment, Share) */}
      <div className="relative px-2 py-1 grid grid-cols-3 gap-1">
        {/* Like Button with Hover Reaction Dock */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnterLike}
          onMouseLeave={handleMouseLeaveLike}
        >
          {showReactionsDock && (
            <div className="absolute -top-12 left-0 z-40 bg-white dark:bg-[#242526] shadow-2xl rounded-full border border-zinc-200 dark:border-zinc-700/80 px-2 py-1 flex items-center gap-2 reaction-dock-anim">
              {REACTIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleReactionClick(r.id)}
                  className="text-2xl transform hover:scale-135 transition duration-150 p-1 hover:-translate-y-1"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => handleReactionClick(post.userReaction ? null : "like")}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-xs font-semibold ${
              currentReactionObj ? `${currentReactionObj.color} font-bold` : "text-zinc-600 dark:text-zinc-300"
            }`}
          >
            {currentReactionObj ? (
              <>
                <span className="text-base">{currentReactionObj.emoji}</span>
                <span>{currentReactionObj.label}</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </>
            )}
          </button>
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-zinc-600 dark:text-zinc-300 text-xs font-semibold"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => onShare(post.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-zinc-600 dark:text-zinc-300 text-xs font-semibold"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="p-3.5 pt-2 border-t border-zinc-100 dark:border-zinc-700/60 bg-zinc-50/60 dark:bg-[#18191a]/30 space-y-3">
          {/* Comments List */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-2.5 items-start">
                <img
                  src={comment.author?.avatar}
                  alt={comment.author?.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <div className="bg-zinc-100 dark:bg-[#3a3b3c] px-3.5 py-2 rounded-2xl inline-block max-w-[90%]">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                      {comment.author?.name}
                    </p>
                    <p className="text-xs text-zinc-800 dark:text-[#e4e6eb] mt-0.5 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-2 mt-1 text-[10px] text-zinc-500 font-semibold">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                    <span>{comment.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 flex items-center bg-zinc-100 dark:bg-[#3a3b3c] rounded-full px-3 py-1.5 border border-transparent focus-within:border-[#1877f2] transition">
              <input
                type="text"
                placeholder={`Write a comment as ${currentUser?.name?.split(" ")[0]}...`}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-900 dark:text-[#e4e6eb] placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="p-1 text-[#1877f2] disabled:opacity-30 hover:scale-110 transition"
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
