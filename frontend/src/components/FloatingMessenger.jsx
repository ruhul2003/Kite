"use client";

import { useState } from "react";
import { X, Minus, Send, Sparkles, Zap, MessageSquare } from "lucide-react";

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
            className={`pointer-events-auto w-80 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-200 ${
              isMinimized ? "h-12" : "h-96"
            }`}
          >
            {/* Header */}
            <div
              onClick={() => toggleMinimize(friend.id)}
              className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  {friend.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {friend.name}
                  </p>
                  <p className="text-[10px] text-indigo-500 dark:text-cyan-400 truncate flex items-center gap-1">
                    <span>⚡ Whisper Active</span>
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-1 text-slate-400"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => toggleMinimize(friend.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onCloseChat(friend.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Body & Input */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs bg-slate-50/40 dark:bg-slate-950/40 scrollbar-thin">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-amber-500 opacity-80" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">{friend.name}</p>
                      <p className="text-[11px] mt-1">Start a private whisper in your circle! 🚀</p>
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
                              className="w-6 h-6 rounded-lg object-cover shrink-0 mb-0.5"
                            />
                          )}
                          <div
                            className={`px-3 py-2 rounded-2xl max-w-[75%] break-words ${
                              isMe
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs shadow-xs"
                                : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60"
                            }`}
                          >
                            <p className="leading-snug">{m.text}</p>
                            <span className="block text-[9px] opacity-70 mt-0.5 text-right font-mono">
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
                  className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Send a whisper spark..."
                    value={inputs[friend.id] || ""}
                    onChange={(e) => handleInputChange(friend.id, e.target.value)}
                    className="flex-1 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputs[friend.id]?.trim()}
                    className="p-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-full disabled:opacity-30 hover:scale-105 transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
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
