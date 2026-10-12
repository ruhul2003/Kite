"use client";

import { Search, MoreHorizontal, Gift, ExternalLink, UserCheck, Check, X } from "lucide-react";

export default function RightSidebar({
  friends,
  friendRequests,
  onAcceptRequest,
  onDeclineRequest,
  onOpenChatWithFriend,
}) {
  return (
    <aside className="w-[300px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-3 py-3 hidden lg:block select-none scrollbar-thin">
      {/* Sponsored Ad Card */}
      <div className="mb-4 pb-3 border-b border-zinc-200/80 dark:border-zinc-700/60">
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
          Sponsored
        </p>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] transition group"
        >
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80"
            alt="Ad"
            className="w-24 h-24 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-[#e4e6eb] group-hover:text-[#1877f2] line-clamp-2">
              Next-Gen Cloud Workstations for Developers
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
              <span>cloudstack.dev</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </p>
          </div>
        </a>
      </div>

      {/* Friend Requests Section */}
      {friendRequests && friendRequests.length > 0 && (
        <div className="mb-4 pb-3 border-b border-zinc-200/80 dark:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Friend Requests
            </p>
            <span className="text-xs text-[#1877f2] font-semibold hover:underline cursor-pointer">
              See all
            </span>
          </div>

          <div className="space-y-3">
            {friendRequests.map((req) => (
              <div
                key={req.id}
                className="p-2.5 bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-zinc-200/70 dark:border-zinc-700/60 transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={req.avatar}
                    alt={req.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {req.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      {req.mutualFriends} mutual friends · {req.time}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => onAcceptRequest(req)}
                    className="py-1.5 px-3 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirm
                  </button>
                  <button
                    onClick={() => onDeclineRequest(req.id)}
                    className="py-1.5 px-3 bg-zinc-200 dark:bg-[#3a3b3c] hover:bg-zinc-300 dark:hover:bg-[#4e4f50] text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Birthdays Widget */}
      <div className="mb-4 pb-3 border-b border-zinc-200/80 dark:border-zinc-700/60">
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
          Birthdays
        </p>

        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] cursor-pointer transition">
          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-[#1877f2] flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-xs text-zinc-800 dark:text-[#e4e6eb] leading-snug">
            <span className="font-bold">Sarah Chen</span> and <span className="font-bold">2 others</span> have birthdays today.
          </p>
        </div>
      </div>

      {/* Contacts / Online Friends Section */}
      <div>
        <div className="flex items-center justify-between px-2 mb-2">
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Contacts ({friends?.length || 0})
          </p>
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <button className="p-1 hover:bg-zinc-200 dark:hover:bg-[#3a3b3c] rounded-full transition" title="Search Contacts">
              <Search className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:bg-zinc-200 dark:hover:bg-[#3a3b3c] rounded-full transition" title="Options">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-0.5">
          {friends?.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onOpenChatWithFriend(friend)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c] transition text-left group"
            >
              <div className="relative shrink-0">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {friend.online ? (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#242526]" />
                ) : (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-zinc-400 ring-2 ring-white dark:ring-[#242526]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-900 dark:text-[#e4e6eb] truncate group-hover:text-[#1877f2]">
                  {friend.name}
                </p>
                <p className="text-[10px] text-zinc-400 truncate">
                  {friend.online ? "Active now" : friend.lastSeen || "Offline"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
