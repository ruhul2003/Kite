"use client";

import { useState, useRef, useEffect } from "react";
import { X, Minus, Send, Smile, Phone, Video, MoreVertical, MessageCircle } from "lucide-react";

export default function FloatingMessenger({
  activeChats,
  conversations,
  currentUser,
  onCloseChat,
  onSendMessage,
  onOpenChat,
  friends,
}) {
  const [minimizedChats, setMinimizedChats] = useState({});
  const [inputs, setInputs] = useState({});
  const messagesEndRef = useRef({});

  const toggleMinimize = (friendId) => {
    setMinimizedChats((prev) => ({ ...prev, [friendId]: !prev[friendId] }));
  };

  const handleInputChange = (friendId, val) => {
    setInputs((prev) => ({ ...prev, [friendId]: val }));
  };

  const handleSend = (friendId, e) => {
    e.preventDefault();
    const text = inputs[friendId];
    if (!text || !text.trim()) return;

    onSendMessage(friendId, text.trim());
    setInputs((prev) => ({ ...prev, [friendId]: "" }));
  };

  return (
    <div className="fixed bottom-0 right-4 z-50 flex items-end gap-3 pointer-events-none select-none">
      {activeChats.map((friend) => {
        const isMinimized = minimizedChats[friend.id];
        const messages = conversations[friend.id] || [];

        return (
          <div
            key={friend.id}
            className={`pointer-events-auto w-80 bg-white dark:bg-[#242526] rounded-t-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700/80 overflow-hidden flex flex-col transition-all duration-200 ${
              isMinimized ? "h-12" : "h-96"
            }`}
          >
            {/* Header */}
            <div
              onClick={() => toggleMinimize(friend.id)}
              className="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-[#242526] border-b border-zinc-200 dark:border-zinc-700/60 cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {friend.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#242526]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                    {friend.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {friend.online ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => toggleMinimize(friend.id)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] rounded-full transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onCloseChat(friend.id)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & Input when not minimized */}
            {!isMinimized && (
              <>
                {/* Messages list */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs bg-zinc-50/50 dark:bg-[#18191a]/40">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      <p className="font-bold text-zinc-700 dark:text-zinc-300">{friend.name}</p>
                      <p className="text-[11px] mt-1">You&apos;re connected on Kite. Say hello! 👋</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.senderId === currentUser.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex items-end gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          {!isMe && (
                            <img
                              src={friend.avatar}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover shrink-0 mb-0.5"
                            />
                          )}
                          <div
                            className={`px-3 py-2 rounded-2xl max-w-[75%] break-words ${
                              isMe
                                ? "bg-[#1877f2] text-white rounded-br-xs"
                                : "bg-zinc-200 dark:bg-[#3a3b3c] text-zinc-900 dark:text-[#e4e6eb] rounded-bl-xs"
                            }`}
                          >
                            <p className="leading-snug">{m.text}</p>
                            <span className="block text-[9px] opacity-70 mt-0.5 text-right">
                              {m.time}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message input */}
                <form
                  onSubmit={(e) => handleSend(friend.id, e)}
                  className="p-2 bg-white dark:bg-[#242526] border-t border-zinc-200 dark:border-zinc-700/60 flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    placeholder="Aa..."
                    value={inputs[friend.id] || ""}
                    onChange={(e) => handleInputChange(friend.id, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-zinc-100 dark:bg-[#3a3b3c] rounded-full text-xs text-zinc-900 dark:text-[#e4e6eb] placeholder-zinc-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputs[friend.id]?.trim()}
                    className="p-1.5 text-[#1877f2] disabled:opacity-30 hover:scale-110 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
