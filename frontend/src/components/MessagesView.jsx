"use client";

import { useState, useMemo, useRef, useEffect } from "react";
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
  Phone,
  Video,
  Info,
  Send,
  Smile,
  Paperclip,
  Mic,
  MicOff,
  Image as ImageIcon,
  ThumbsUp,
  Heart,
  PhoneOff,
  VideoOff,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Pin,
  Trash2,
  Shield,
  ExternalLink,
} from "lucide-react";

const EMOJI_LIST = [
  "😊", "😂", "🔥", "❤️", "👍", "🎉", "🚀", "✨",
  "👏", "💡", "⚡", "☕", "🙌", "😎", "🤩", "💯",
  "🤝", "🎯", "🌟", "😍", "🥳", "🙏", "💪", "🌈",
];

const SAMPLE_ATTACHMENTS = [
  {
    name: "Design-Sprint-Preview.png",
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    caption: "Latest Kite dashboard mockup preview ✨",
  },
  {
    name: "Coastline-Sunset.jpg",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    caption: "Golden hour capture from the trail 🌄",
  },
  {
    name: "Workspace-Setup.jpg",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    caption: "Current coding environment setup 💻",
  },
];

export default function MessagesView({
  currentUser,
  friends = [],
  conversations = {},
  selectedFriendId,
  onSelectFriend,
  onSendMessage,
  typingUsers = {},
  onOpenProfile,
  onToggleDetails,
  showDetailsPanel = false,
  onOpenNewChat,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'unread' | 'online'
  const [messageText, setMessageText] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [activeCallType, setActiveCallType] = useState(null); // 'voice' | 'video' | null
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [imageLightbox, setImageLightbox] = useState(null);
  const [searchInChat, setSearchInChat] = useState("");
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Determine active friend object
  const activeFriend = useMemo(() => {
    if (selectedFriendId) {
      const found = friends.find((f) => f.id === selectedFriendId);
      if (found) return found;
    }
    return friends.length > 0 ? friends[0] : null;
  }, [friends, selectedFriendId]);

  // Current active conversation messages
  const currentMessages = useMemo(() => {
    if (!activeFriend) return [];
    const list = conversations[activeFriend.id] || [];
    if (!searchInChat.trim()) return list;
    const q = searchInChat.toLowerCase();
    return list.filter((m) => m.text?.toLowerCase().includes(q));
  }, [activeFriend, conversations, searchInChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, activeFriend?.id]);

  // Simulated Call Timer
  useEffect(() => {
    let interval = null;
    if (activeCallType) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCallType]);

  // Simulated Voice Note Timer
  useEffect(() => {
    let interval = null;
    if (isRecordingVoice) {
      setVoiceTimer(0);
      interval = setInterval(() => {
        setVoiceTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setVoiceTimer(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingVoice]);

  // Format call duration
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
      if (filterTab === "online" && !isOnline) return false;
      if (filterTab === "unread" && !hasUnread) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = friend.name?.toLowerCase().includes(q);
      const matchMsg = lastMsg?.text?.toLowerCase().includes(q);
      return matchName || matchMsg;
    });
  }, [conversationItems, filterTab, searchQuery]);

  // Handle Send Text Message
  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeFriend) return;
    onSendMessage(activeFriend.id, messageText.trim());
    setMessageText("");
    setIsEmojiPickerOpen(false);
  };

  // Handle Quick Reaction / Like
  const handleQuickLike = () => {
    if (!activeFriend) return;
    onSendMessage(activeFriend.id, "👍");
  };

  // Handle Send Attachment
  const handleSendAttachment = (sample) => {
    if (!activeFriend) return;
    onSendMessage(
      activeFriend.id,
      `${sample.caption} [Media Attachment: ${sample.name}]`
    );
    setIsAttachMenuOpen(false);
  };

  // Handle Send Voice Note
  const handleFinishVoiceNote = () => {
    if (!activeFriend) return;
    const dur = formatTimer(voiceTimer);
    onSendMessage(
      activeFriend.id,
      `🎙️ Audio Spark Voice Note (${dur})`
    );
    setIsRecordingVoice(false);
  };

  return (
    <div className="w-full h-[calc(100vh-4.25rem)] flex bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
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
              onClick={onOpenNewChat}
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

      {/* CENTRAL PANE: Active Chat Thread */}
      <section className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-950/40 relative">
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
              onClick={onOpenNewChat}
              className="mt-4 px-4 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold rounded-full shadow-xs transition cursor-pointer"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Active Chat Header */}
            <header className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-xs z-10">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => onSelectFriend(null)}
                  className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  className="relative cursor-pointer group"
                  onClick={() => onOpenProfile?.(activeFriend)}
                >
                  <img
                    src={activeFriend.avatar}
                    alt={activeFriend.name}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-[#1877f2] transition"
                  />
                  {activeFriend.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2
                    className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate cursor-pointer hover:text-[#1877f2] transition"
                    onClick={() => onOpenProfile?.(activeFriend)}
                  >
                    {activeFriend.name}
                  </h2>
                  <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                    {typingUsers[activeFriend.id] ? (
                      <span className="text-[#1877f2] font-semibold animate-pulse">
                        typing a message...
                      </span>
                    ) : activeFriend.online ? (
                      <span className="text-emerald-500 font-medium">Active now</span>
                    ) : (
                      <span>Offline · {activeFriend.lastSeen || "recently"}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Chat Header Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveCallType("voice")}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#1877f2] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Start Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveCallType("video")}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#1877f2] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Start Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isChatSearchOpen
                      ? "bg-[#1877f2]/10 text-[#1877f2]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Search in conversation"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={onToggleDetails}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    showDetailsPanel
                      ? "bg-[#1877f2]/10 text-[#1877f2]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Conversation Details"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* In-Chat Search Bar Toggle */}
            {isChatSearchOpen && (
              <div className="px-4 py-2 bg-slate-100/90 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Find in conversation..."
                    value={searchInChat}
                    onChange={(e) => setSearchInChat(e.target.value)}
                    className="w-full bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{currentMessages.length} results</span>
                  <button
                    onClick={() => {
                      setSearchInChat("");
                      setIsChatSearchOpen(false);
                    }}
                    className="p-1 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Message Thread Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
              {/* Date Divider */}
              <div className="flex items-center justify-center my-2">
                <span className="px-3 py-1 bg-slate-200/60 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                  Today
                </span>
              </div>

              {currentMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <img
                    src={activeFriend.avatar}
                    alt=""
                    className="w-16 h-16 rounded-3xl object-cover mx-auto mb-3 shadow-sm ring-2 ring-[#1877f2]/20"
                  />
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    {activeFriend.name}
                  </h3>
                  <p className="text-xs max-w-xs mx-auto mt-1 text-slate-400">
                    {activeFriend.bio || "Connected on Kite. Say hello or send an audio spark!"}
                  </p>
                </div>
              ) : (
                currentMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  const isAudioSpark = msg.text?.startsWith("🎙️");

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 group ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMe && (
                        <img
                          src={activeFriend.avatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                        />
                      )}

                      <div className="relative max-w-[78%] sm:max-w-[70%]">
                        {/* Audio Spark Bubble */}
                        {isAudioSpark ? (
                          <div
                            className={`p-3 rounded-2xl ${
                              isMe
                                ? "bg-[#1877f2] text-white rounded-br-xs shadow-xs"
                                : "bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)
                                }
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                                  isMe
                                    ? "bg-white/20 hover:bg-white/30 text-white"
                                    : "bg-[#1877f2] hover:bg-[#166fe5] text-white"
                                }`}
                              >
                                {playingAudioId === msg.id ? (
                                  <Pause className="w-4 h-4 fill-current" />
                                ) : (
                                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                                )}
                              </button>

                              <div className="flex-1 min-w-[120px]">
                                <p className="text-xs font-bold leading-tight">
                                  Audio Spark Note
                                </p>
                                {/* Soundwave Simulation */}
                                <div className="flex items-center gap-1 h-4 mt-1">
                                  {[35, 60, 90, 45, 80, 100, 70, 50, 85, 40, 65, 30].map(
                                    (val, idx) => (
                                      <span
                                        key={idx}
                                        style={{ height: `${val}%` }}
                                        className={`w-1 rounded-full ${
                                          isMe
                                            ? "bg-white/70"
                                            : "bg-[#1877f2]/80"
                                        } ${
                                          playingAudioId === msg.id
                                            ? "animate-pulse"
                                            : ""
                                        }`}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="block text-[9px] opacity-75 mt-1 text-right font-mono">
                              {msg.time}
                            </span>
                          </div>
                        ) : (
                          /* Regular Text Bubble */
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-xs ${
                              isMe
                                ? "bg-[#1877f2] text-white rounded-br-xs shadow-xs"
                                : "bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 border border-slate-200/70 dark:border-slate-800 rounded-bl-xs"
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75 font-mono">
                              <span>{msg.time}</span>
                              {isMe && <CheckCheck className="w-3 h-3 stroke-[2.5]" />}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator bubble */}
              {typingUsers[activeFriend.id] && (
                <div className="flex items-center gap-2">
                  <img
                    src={activeFriend.avatar}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="bg-white dark:bg-slate-850 px-3.5 py-2 rounded-2xl rounded-bl-xs border border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-[#1877f2] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#1877f2] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#1877f2] rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Recording Voice Note Banner */}
            {isRecordingVoice && (
              <div className="px-4 py-3 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900/40 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    Recording Audio Spark...
                  </span>
                  <span className="font-mono text-xs font-semibold text-rose-700 dark:text-rose-300">
                    {formatTimer(voiceTimer)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecordingVoice(false)}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinishVoiceNote}
                    className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    Send Note
                  </button>
                </div>
              </div>
            )}

            {/* Attachments Dropdown Menu */}
            {isAttachMenuOpen && (
              <div className="absolute bottom-16 left-4 z-30 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-1 w-64 animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Send Sample Media
                </p>
                {SAMPLE_ATTACHMENTS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAttachment(s)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer text-xs text-slate-700 dark:text-slate-300"
                  >
                    <ImageIcon className="w-4 h-4 text-[#1877f2] shrink-0" />
                    <span className="truncate flex-1 font-medium">{s.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Emoji Picker Popover */}
            {isEmojiPickerOpen && (
              <div className="absolute bottom-16 left-12 z-30 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-64 animate-in fade-in zoom-in-95">
                <div className="grid grid-cols-6 gap-1.5 text-lg">
                  {EMOJI_LIST.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setMessageText((prev) => prev + emoji)}
                      className="p-1 hover:scale-125 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-center cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Message Composer Input Bar */}
            <footer className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                {/* Media Attachment Button */}
                <button
                  type="button"
                  onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                  className="p-2 rounded-xl text-slate-500 hover:text-[#1877f2] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Attach Media"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Emoji Picker Button */}
                <button
                  type="button"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className="p-2 rounded-xl text-slate-500 hover:text-[#1877f2] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Insert Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {/* Voice Note Recording Button */}
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isRecordingVoice
                      ? "bg-rose-500 text-white"
                      : "text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Record Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  placeholder={`Message ${activeFriend.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] border border-slate-200/60 dark:border-slate-700/60 transition"
                />

                {/* Send or Quick Thumbs-up */}
                {messageText.trim() ? (
                  <button
                    type="submit"
                    className="p-2.5 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleQuickLike}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1877f2] transition cursor-pointer"
                    title="Send Like"
                  >
                    <ThumbsUp className="w-4 h-4 fill-current" />
                  </button>
                )}
              </form>
            </footer>
          </div>
        )}

        {/* SIMULATED VOICE CALL MODAL */}
        {activeCallType === "voice" && activeFriend && (
          <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-between p-8 text-white animate-in fade-in duration-200">
            <div className="text-center pt-8">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                Kite Voice Spark
              </span>
              <h2 className="text-2xl font-bold mt-4">{activeFriend.name}</h2>
              <p className="text-sm font-mono text-slate-400 mt-1">
                Connected · {formatTimer(callDuration)}
              </p>
            </div>

            {/* Pulsing Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-[#1877f2]/30 absolute -inset-2 animate-ping opacity-50"></div>
              <img
                src={activeFriend.avatar}
                alt={activeFriend.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-[#1877f2] shadow-2xl relative z-10"
              />
            </div>

            {/* Call Controls */}
            <div className="flex items-center gap-4 pb-8">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3.5 rounded-full transition cursor-pointer ${
                  isMicMuted ? "bg-rose-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                title={isMicMuted ? "Unmute" : "Mute"}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setActiveCallType(null)}
                className="p-4 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg transition cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* SIMULATED VIDEO CALL MODAL */}
        {activeCallType === "video" && activeFriend && (
          <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col justify-between p-4 text-white animate-in fade-in duration-200">
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <img
                  src={activeFriend.avatar}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-white"
                />
                <div>
                  <h3 className="text-sm font-bold">{activeFriend.name}</h3>
                  <p className="text-[10px] font-mono text-emerald-400">
                    HD Video · {formatTimer(callDuration)}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-black/40 backdrop-blur rounded-full text-[10px] font-semibold text-slate-300">
                Encrypted Connection
              </span>
            </div>

            {/* Simulated Video Streams */}
            <div className="relative flex-1 rounded-2xl overflow-hidden my-3 bg-slate-900 flex items-center justify-center">
              <img
                src={activeFriend.coverPhoto || activeFriend.avatar}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Picture in picture self view */}
              <div className="absolute bottom-4 right-4 w-28 h-36 bg-slate-800 rounded-xl overflow-hidden border-2 border-white/40 shadow-xl">
                <img
                  src={currentUser?.avatar}
                  alt="You"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-2 text-[9px] font-bold bg-black/60 px-1 rounded text-white">
                  You
                </span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-center gap-4 py-2 z-10">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3 rounded-full transition cursor-pointer ${
                  isMicMuted ? "bg-rose-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className={`p-3 rounded-full transition cursor-pointer ${
                  isVideoMuted ? "bg-rose-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setActiveCallType(null)}
                className="p-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg transition cursor-pointer"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
