"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MessageSquare,
  Plus,
  X,
  Check,
  CheckCheck,
  ChevronLeft,
  Circle,
  Sparkles,
  Users,
} from "lucide-react";

export default function MessagesView({
  currentUser,
  friends = [],
  conversations = {},
  selectedFriendId,
  onSelectFriend,
  onSendMessage,
  typingUsers = {},
  onOpenProfile,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'unread' | 'online'
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  // Determine active friend object
  const activeFriend = useMemo(() => {
    if (selectedFriendId) {
      const found = friends.find((f) => f.id === selectedFriendId);
      if (found) return found;
    }
    return friends.length > 0 ? friends[0] : null;
  }, [friends, selectedFriendId]);

  // Build conversations summary list
  const conversationItems = useMemo(() => {
    return friends.map((friend) => {
      const msgs = conversations[friend.id] || [];
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const isOnline = !!friend.online;
      const isTyping = !!typingUsers[friend.id];
      const hasUnread = msgs.some((m) => m.senderId === friend.id && !m.read);

      return {
        friend,
        lastMsg,
        isOnline,
        isTyping,
        hasUnread,
        messageCount: msgs.length,
      };
    });
  }, [friends, conversations, typingUsers]);

  // Filter conversations by search and tab
  const filteredConversations = useMemo(() => {
    return conversationItems.filter(({ friend, lastMsg, isOnline, hasUnread }) => {
      // Tab filter
      if (filterTab === "online" && !isOnline) return false;
      if (filterTab === "unread" && !hasUnread) return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = friend.name?.toLowerCase().includes(q);
      const matchMsg = lastMsg?.text?.toLowerCase().includes(q);
      return matchName || matchMsg;
    });
  }, [conversationItems, filterTab, searchQuery]);

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] flex bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* LEFT PANE: Conversations Sidebar */}
      <aside
        className={`w-full md:w-80 lg:w-96 shrink-0 flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 ${
          activeFriend ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Messages
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">
                  {friends.filter((f) => f.online).length} friends online now
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNewChatOpen(true)}
              className="p-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-xs transition cursor-pointer"
              title="New Message"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations & friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800/80 text-xs rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/30 focus:border-[#1877f2] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterTab === "all"
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Chats ({friends.length})
            </button>
            <button
              onClick={() => setFilterTab("online")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === "online"
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Online
            </button>
            <button
              onClick={() => setFilterTab("unread")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterTab === "unread"
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Conversation List Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 scrollbar-thin">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No conversations found
              </p>
              <p className="text-[11px] mt-1">
                {searchQuery ? "Try a different search query." : "Start a new chat with your friends."}
              </p>
            </div>
          ) : (
            filteredConversations.map(({ friend, lastMsg, isOnline, isTyping, hasUnread }) => {
              const isSelected = activeFriend?.id === friend.id;

              return (
                <button
                  key={friend.id}
                  onClick={() => onSelectFriend(friend)}
                  className={`w-full flex items-center gap-3 p-3.5 text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-[#1877f2]/10 dark:bg-[#1877f2]/20 border-l-4 border-[#1877f2]"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {/* Friend Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    {isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                    )}
                  </div>

                  {/* Conversation Snippet */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p
                        className={`text-xs font-bold truncate ${
                          isSelected
                            ? "text-[#1877f2] dark:text-[#3b82f6]"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {friend.name}
                      </p>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-1">
                          {lastMsg.time}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] truncate flex items-center gap-1">
                      {isTyping ? (
                        <span className="text-[#1877f2] font-semibold animate-pulse">
                          typing...
                        </span>
                      ) : lastMsg ? (
                        <span
                          className={
                            hasUnread
                              ? "font-bold text-slate-900 dark:text-slate-100"
                              : "text-slate-500 dark:text-slate-400"
                          }
                        >
                          {lastMsg.senderId === currentUser?.id ? "You: " : ""}
                          {lastMsg.text}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No messages yet</span>
                      )}
                    </p>
                  </div>

                  {/* Badges */}
                  {hasUnread && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1877f2] shrink-0"></span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* RIGHT PANE: Chat Area Placeholder (extended in next commit) */}
      <section className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-950/40">
        {!activeFriend ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="w-16 h-16 rounded-3xl bg-[#1877f2]/10 flex items-center justify-center text-[#1877f2] mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Select a Conversation
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Choose someone from your contact list or start a new chat with your circle.
            </p>
            <button
              onClick={() => setIsNewChatOpen(true)}
              className="mt-4 px-4 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold rounded-full shadow-xs transition cursor-pointer"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Base Chat Header Placeholder */}
            <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectFriend(null)}
                  className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img
                    src={activeFriend.avatar}
                    alt={activeFriend.name}
                    className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  {activeFriend.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {activeFriend.name}
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    {activeFriend.online ? "Active Now" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Conversation Messages View Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {(conversations[activeFriend.id] || []).map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <img
                        src={activeFriend.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs ${
                        isMe
                          ? "bg-[#1877f2] text-white rounded-br-xs shadow-xs"
                          : "bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 border border-slate-200/70 dark:border-slate-800 rounded-bl-xs"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className="block text-[9px] opacity-75 mt-1 text-right font-mono">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
