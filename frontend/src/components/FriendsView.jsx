"use client";

import { useState } from "react";
import { UserCheck, UserPlus, Check, X, MessageCircle, MoreHorizontal } from "lucide-react";

export default function FriendsView({
  friends,
  friendRequests,
  onAcceptRequest,
  onDeclineRequest,
  onOpenChatWithFriend,
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'requests' | 'suggestions'

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Friends</h2>
          <p className="text-xs text-zinc-500">Manage connections and new requests</p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-[#3a3b3c] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "all" ? "bg-white dark:bg-[#242526] text-[#1877f2] shadow-sm" : "text-zinc-600 dark:text-zinc-300"
            }`}
          >
            All Friends ({friends?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "requests" ? "bg-white dark:bg-[#242526] text-[#1877f2] shadow-sm" : "text-zinc-600 dark:text-zinc-300"
            }`}
          >
            Requests ({friendRequests?.length || 0})
          </button>
        </div>
      </div>

      {/* FRIEND REQUESTS SECTION */}
      {activeTab === "requests" && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-1">
            Pending Friend Requests
          </h3>
          {friendRequests?.length === 0 ? (
            <div className="bg-white dark:bg-[#242526] p-8 rounded-2xl text-center text-zinc-400">
              <UserCheck className="w-10 h-10 mx-auto mb-2 text-zinc-300" />
              <p className="font-semibold text-zinc-700 dark:text-zinc-200">No pending friend requests</p>
              <p className="text-xs mt-1">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friendRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-[#242526] p-3.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-3.5"
                >
                  <img
                    src={req.avatar}
                    alt={req.name}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                      {req.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {req.mutualFriends} mutual friends · {req.time}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onAcceptRequest(req)}
                        className="py-1 px-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-lg transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => onDeclineRequest(req.id)}
                        className="py-1 px-3 bg-zinc-100 dark:bg-[#3a3b3c] hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ALL FRIENDS GRID */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {friends?.map((friend) => (
            <div
              key={friend.id}
              className="bg-white dark:bg-[#242526] p-3.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  {friend.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#242526]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                    {friend.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {friend.mutualFriends} mutual friends
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenChatWithFriend(friend)}
                className="w-9 h-9 rounded-xl bg-[#1877f2]/10 hover:bg-[#1877f2]/20 text-[#1877f2] flex items-center justify-center shrink-0 transition"
                title="Send Message"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
