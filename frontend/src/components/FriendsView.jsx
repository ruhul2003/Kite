"use client";

import { useState } from "react";
import { UserCheck, MessageSquare } from "lucide-react";

export default function FriendsView({
  friends,
  friendRequests,
  onAcceptRequest,
  onDeclineRequest,
  onOpenChatWithFriend,
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'requests'

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Friends</h2>
          <p className="text-xs text-slate-500">Manage connections and new requests</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "all" ? "bg-white dark:bg-slate-900 text-[#1877f2] shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            All Friends ({friends?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "requests" ? "bg-white dark:bg-slate-900 text-[#1877f2] shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Requests ({friendRequests?.length || 0})
          </button>
        </div>
      </div>

      {/* FRIEND REQUESTS SECTION */}
      {activeTab === "requests" && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Pending Friend Requests
          </h3>
          {friendRequests?.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center text-slate-400 border border-slate-200 dark:border-slate-800">
              <UserCheck className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No pending friend requests</p>
              <p className="text-xs mt-1">You are all caught up.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friendRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3.5"
                >
                  <img
                    src={req.avatar}
                    alt={req.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {req.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {req.mutualFriends} mutual friends · {req.time}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onAcceptRequest(req)}
                        className="py-1 px-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-xs rounded-lg transition cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => onDeclineRequest(req.id)}
                        className="py-1 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
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
              className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {friend.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {friend.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {friend.mutualFriends} mutual friends
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenChatWithFriend(friend)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 transition cursor-pointer"
                title="Send Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

