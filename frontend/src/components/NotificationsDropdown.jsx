"use client";

import { Bell, ThumbsUp, MessageSquare, UserPlus } from "lucide-react";

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
      className="absolute right-4 top-14 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Notifications</h3>
        <button
          onClick={onMarkAllRead}
          className="text-xs text-[#1877f2] font-semibold hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto p-2 space-y-1">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
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
                  ? "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                  : "bg-blue-50/70 dark:bg-[#1877f2]/10 hover:bg-blue-50 dark:hover:bg-[#1877f2]/15"
              }`}
            >
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={notif.author?.avatar}
                  alt={notif.author?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1877f2] text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {notif.type === "reaction" ? (
                    <ThumbsUp className="w-2.5 h-2.5 text-white" />
                  ) : notif.type === "comment" ? (
                    <MessageSquare className="w-2.5 h-2.5 text-white" />
                  ) : (
                    <UserPlus className="w-2.5 h-2.5 text-white" />
                  )}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                  <span className="font-bold">{notif.author?.name}</span> {notif.text}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{notif.timestamp}</p>
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

