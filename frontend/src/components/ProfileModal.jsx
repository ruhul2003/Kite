"use client";

import { useState } from "react";
import { X, Camera, Briefcase, MapPin, Calendar, Edit3, Check } from "lucide-react";
import PostCard from "./PostCard";

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  userPosts,
  onUpdateProfile,
  onReact,
  onAddComment,
  onToggleSave,
  onDeletePost,
  onShare,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [work, setWork] = useState(currentUser?.work || "");
  const [livesIn, setLivesIn] = useState(currentUser?.livesIn || "");

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      bio,
      work,
      livesIn,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in select-none">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#242526] rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700/80 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Cover Photo */}
          <div className="relative h-44 sm:h-60 w-full bg-zinc-200 dark:bg-zinc-800">
            <img
              src={currentUser?.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Profile Header Details */}
          <div className="px-6 pb-4 border-b border-zinc-200 dark:border-zinc-700/60">
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-[#242526] overflow-hidden shadow-xl bg-zinc-100">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                    {currentUser?.name}
                    {currentUser?.isGuest && (
                      <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                        Guest
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {currentUser?.friendsCount || 0} friends · {userPosts.length} posts
                  </p>
                </div>
              </div>

              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-[#3a3b3c] hover:bg-zinc-200 dark:hover:bg-[#4e4f50] text-zinc-900 dark:text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                )}
              </div>
            </div>

            {/* Edit Mode Inputs or Display Bio */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-100 dark:bg-[#3a3b3c] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Bio</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-100 dark:bg-[#3a3b3c] rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Workplace</label>
                    <input
                      type="text"
                      value={work}
                      onChange={(e) => setWork(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-zinc-100 dark:bg-[#3a3b3c] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Lives in</label>
                    <input
                      type="text"
                      value={livesIn}
                      onChange={(e) => setLivesIn(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-zinc-100 dark:bg-[#3a3b3c] rounded-lg"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">
                  {currentUser?.bio}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Works at {currentUser?.work}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Lives in {currentUser?.livesIn}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Joined {currentUser?.joined}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Posts Feed by This User */}
          <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-[#18191a]/40">
            <h3 className="font-bold text-sm text-zinc-500 uppercase tracking-wider mb-3">
              Posts by {currentUser?.name}
            </h3>

            {userPosts.length === 0 ? (
              <div className="bg-white dark:bg-[#242526] p-8 rounded-2xl text-center text-zinc-400 border border-zinc-200 dark:border-zinc-700/60">
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">No posts yet</p>
                <p className="text-xs mt-1">Share a thought or photo to get started!</p>
              </div>
            ) : (
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onReact={onReact}
                  onAddComment={onAddComment}
                  onToggleSave={onToggleSave}
                  onDeletePost={onDeletePost}
                  onShare={onShare}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
