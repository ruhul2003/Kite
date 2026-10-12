"use client";

import { Check, Heart, MessageCircle, UserPlus, Sparkles, Bell } from "lucide-react";

export default function NotificationsDropdown({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute right-4 top-14 w-80 sm:w-96 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700/80 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-700/60">
        <h3 className="font-bold text-base text-zinc-900 dark:text-white">Notifications</h3>
        <button
          onClick={onMarkAllRead}
          className="text-xs text-[#1877f2] font-semibold hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto p-2 space-y-1">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif.id)}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition cursor-pointer ${
                notif.read
                  ? "hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] opacity-80"
                  : "bg-blue-50/60 dark:bg-[#1877f2]/10 hover:bg-blue-50 dark:hover:bg-[#1877f2]/15"
              }`}
            >
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={notif.author?.avatar}
                  alt={notif.author?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-[#242526]">
                  {notif.type === "reaction" ? "❤️" : notif.type === "comment" ? "💬" : "👥"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-800 dark:text-[#e4e6eb] leading-snug">
                  <span className="font-bold">{notif.author?.name}</span> {notif.text}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{notif.timestamp}</p>
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877f2] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
