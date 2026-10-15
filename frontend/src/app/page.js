"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import StoriesTray from "../components/StoriesTray";
import CreatePostBox from "../components/CreatePostBox";
import PostCard from "../components/PostCard";
import { useRouter } from "next/navigation";
import {
  apiCreatePost,
  apiFetchNotes,
  apiCreateNote,
  apiUpdateNote,
  apiDeleteNote,
  apiTogglePinNote,
  apiToggleChecklistItem,
} from "../utils/api";
import StoryViewerModal from "../components/StoryViewerModal";
import ProfileModal from "../components/ProfileModal";
import ImageViewerModal from "../components/ImageViewerModal";
import FloatingMessenger from "../components/FloatingMessenger";
import NotificationsDropdown from "../components/NotificationsDropdown";
import FriendsView from "../components/FriendsView";
import WatchView from "../components/WatchView";
import MarketplaceView from "../components/MarketplaceView";
import JobsView from "../components/JobsView";
import NotesView from "../components/NotesView";
import MessagesView from "../components/MessagesView";
import {
  joinUser,
  sendRealtimeMessage,
  onReceiveMessage,
  onUserTyping,
  onOnlineUsers,
} from "../utils/socket";
import {
  INITIAL_CURRENT_USER,
  GUEST_USER_TEMPLATE,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_FRIENDS,
  INITIAL_FRIEND_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTES,
} from "../data/mockData";
import { Bookmark } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Authentication & Current User
  const [currentUser, setCurrentUser] = useState(INITIAL_CURRENT_USER);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState("feed"); // 'feed' | 'friends' | 'watch' | 'marketplace' | 'saved'
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Social Data State
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [friendRequests, setFriendRequests] = useState(INITIAL_FRIEND_REQUESTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [notes, setNotes] = useState(INITIAL_NOTES);

  // Modals & Panels State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [activeChats, setActiveChats] = useState([]); // List of friend objects with open chat windows
  const [selectedChatFriendId, setSelectedChatFriendId] = useState(null);
  const [typingUsers, setTypingUsers] = useState({}); // friendId -> isTyping

  // Real-time Socket.io lifecycle
  useEffect(() => {
    if (!currentUser?.id) return;

    // Join user's personal WebSocket room
    joinUser(currentUser.id);

    // Listen for incoming messages in real-time
    const unsubReceive = onReceiveMessage((incomingMsg) => {
      const partnerId = incomingMsg.senderId === currentUser.id ? incomingMsg.receiverId : incomingMsg.senderId;

      setConversations((prev) => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), incomingMsg],
      }));

      // Automatically open or show friend in active chats if not already open
      setActiveChats((prev) => {
        if (!prev.some((c) => c.id === partnerId)) {
          const friend = friends.find((f) => f.id === partnerId) || {
            id: partnerId,
            name: incomingMsg.senderName || "Friend",
            avatar: incomingMsg.senderAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            online: true,
          };
          return [...prev, friend];
        }
        return prev;
      });
    });

    // Listen for real-time typing indicators
    const unsubTyping = onUserTyping(({ senderId, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [senderId]: isTyping }));
    });

    // Listen for real-time online presence
    const unsubOnline = onOnlineUsers((onlineIds) => {
      setFriends((prev) =>
        prev.map((f) => ({
          ...f,
          online: onlineIds.includes(f.id) || f.online,
        }))
      );
    });

    return () => {
      unsubReceive();
      unsubTyping();
      unsubOnline();
    };
  }, [currentUser?.id, friends]);

  // Sync dark mode class with root html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load saved user settings from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("kite_user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedTheme = localStorage.getItem("kite_theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch user notes from backend with fallback
  useEffect(() => {
    if (!currentUser?.id) return;
    apiFetchNotes(currentUser.id)
      .then((fetchedNotes) => {
        if (fetchedNotes && fetchedNotes.length > 0) {
          setNotes(fetchedNotes);
        }
      })
      .catch((err) => console.warn("Failed to load notes:", err.message));
  }, [currentUser?.id]);

  // Note operation handlers
  const handleCreateNote = async (noteData) => {
    const payload = {
      ...noteData,
      userId: currentUser?.id || "user-alex",
    };
    try {
      const created = await apiCreateNote(payload);
      setNotes((prev) => [created, ...prev]);
    } catch (err) {
      console.warn("Error creating note:", err.message);
    }
  };

  const handleUpdateNote = async (noteId, updates) => {
    try {
      await apiUpdateNote(noteId, updates);
      setNotes((prev) =>
        prev.map((n) => ((n.id || n._id) === noteId ? { ...n, ...updates } : n))
      );
    } catch (err) {
      console.warn("Error updating note:", err.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await apiDeleteNote(noteId);
      setNotes((prev) => prev.filter((n) => (n.id || n._id) !== noteId));
    } catch (err) {
      console.warn("Error deleting note:", err.message);
    }
  };

  const handleTogglePinNote = async (noteId) => {
    try {
      setNotes((prev) =>
        prev.map((n) => ((n.id || n._id) === noteId ? { ...n, isPinned: !n.isPinned } : n))
      );
      await apiTogglePinNote(noteId);
    } catch (err) {
      console.warn("Error toggling pin note:", err.message);
    }
  };

  const handleToggleChecklistItem = async (noteId, itemId, completed) => {
    setNotes((prev) =>
      prev.map((n) => {
        if ((n.id || n._id) !== noteId) return n;
        return {
          ...n,
          checklist: (n.checklist || []).map((c) =>
            c.id === itemId ? { ...c, completed } : c
          ),
        };
      })
    );
    try {
      await apiToggleChecklistItem(noteId, itemId, completed);
    } catch (err) {
      console.warn("Error toggling checklist item:", err.message);
    }
  };

  // Save user changes to localStorage
  const handleSetUser = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("kite_user", JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  // Auth actions
  const handleSignup = (newUser) => {
    handleSetUser(newUser);
  };

  const handleLogin = (user) => {
    handleSetUser(user);
  };

  const handleGuestLogin = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const guestUser = {
      ...GUEST_USER_TEMPLATE,
      id: `user-guest-${randomNum}`,
      name: `Guest Explorer #${randomNum}`,
      username: `guest_${randomNum}`,
      email: `guest${randomNum}@kite.local`,
    };
    handleSetUser(guestUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("kite_user");
    router.push("/login");
  };

  const handleOpenAuth = (mode = "signup") => {
    if (mode === "login") {
      router.push("/login");
    } else {
      router.push("/signup");
    }
  };

  // Post Actions
  const handleCreatePost = async (newPost) => {
    setPosts([newPost, ...posts]);
    try {
      await apiCreatePost(newPost);
    } catch {
      // non-blocking fallback
    }
  };

  const handleReactToPost = (postId, reactionType) => {
    setPosts(
      posts.map((p) => {
        if (p.id !== postId) return p;

        const updatedReactions = { ...p.reactions };
        const prevReaction = p.userReaction;

        // Decrement previous reaction count if existing
        if (prevReaction && updatedReactions[prevReaction] > 0) {
          updatedReactions[prevReaction] -= 1;
        }

        // If clicking same reaction, toggle off
        if (prevReaction === reactionType || !reactionType) {
          return {
            ...p,
            userReaction: null,
            reactions: updatedReactions,
          };
        }

        // Increment new reaction count
        updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;

        return {
          ...p,
          userReaction: reactionType,
          reactions: updatedReactions,
        };
      })
    );
  };

  const handleAddComment = (postId, comment) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), comment],
          };
        }
        return p;
      })
    );
  };

  const handleToggleSavePost = (postId) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return { ...p, isSaved: !p.isSaved };
        }
        return p;
      })
    );
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleSharePost = (postId) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return { ...p, sharesCount: (p.sharesCount || 0) + 1 };
        }
        return p;
      })
    );
    alert("Spark echoed to your circle!");
  };

  // Friend Request Actions
  const handleAcceptRequest = (request) => {
    setFriendRequests(friendRequests.filter((r) => r.id !== request.id));
    const newFriend = {
      id: `friend-${Date.now()}`,
      name: request.name,
      avatar: request.avatar,
      online: true,
      mutualFriends: request.mutualFriends,
      work: "Circle Member",
    };
    setFriends([newFriend, ...friends]);
  };

  const handleDeclineRequest = (requestId) => {
    setFriendRequests(friendRequests.filter((r) => r.id !== requestId));
  };

  // Messenger & Chat Actions
  const handleOpenChatWithFriend = (friend) => {
    if (friend?.id) {
      setSelectedChatFriendId(friend.id);
    }
    if (activeTab === "messages") {
      return;
    }
    if (!activeChats.find((c) => c.id === friend.id)) {
      setActiveChats([...activeChats, friend]);
    }
  };

  const handleOpenFullMessages = (friend) => {
    if (friend?.id) {
      setSelectedChatFriendId(friend.id);
    }
    setActiveTab("messages");
  };

  const handleOpenChatWithSeller = (sellerName) => {
    const existing = friends.find((f) => f.name.toLowerCase() === sellerName.toLowerCase());
    const target = existing || {
      id: `seller-${Date.now()}`,
      name: sellerName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      online: true,
    };
    handleOpenFullMessages(target);
  };

  const handleCloseChat = (friendId) => {
    setActiveChats(activeChats.filter((c) => c.id !== friendId));
  };

  const handleSendMessage = (friendId, text) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: friendId,
      text,
      time,
    };

    // 1. Emit via real-time WebSocket to recipient
    sendRealtimeMessage({
      senderId: currentUser.id,
      receiverId: friendId,
      text,
      time,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
    });

    // 2. Update local state
    setConversations((prev) => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), userMsg],
    }));

    // Friendly offline simulated reply if talking to demo account
    if (friendId.startsWith("friend-") || friendId.startsWith("demo-")) {
      setTimeout(() => {
        const replies = [
          "Sounds great, thanks for reaching out!",
          "Got it, appreciate the message.",
          "Thanks for the note, let's catch up soon.",
          "Awesome, let me know if you need anything else.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const friendMsg = {
          id: `reply-${Date.now()}`,
          senderId: friendId,
          receiverId: currentUser.id,
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setConversations((prev) => ({
          ...prev,
          [friendId]: [...(prev[friendId] || []), friendMsg],
        }));
      }, 1200);
    }
  };

  const handleStoryReply = (authorName, text) => {
    const friend = friends.find((f) => f.name.toLowerCase().includes(authorName.toLowerCase())) || friends[0];
    handleOpenChatWithFriend(friend);
    handleSendMessage(friend.id, text);
    setActiveStory(null);
  };

  // Notifications
  const handleMarkAllNotifsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Profile update
  const handleUpdateProfile = (updatedFields) => {
    const updated = { ...currentUser, ...updatedFields };
    handleSetUser(updated);
  };

  // Filter posts by search query, saved view, and Vibe Filter
  // Filter posts by search query and saved view
  const displayedPosts = posts.filter((post) => {
    if (activeTab === "saved" && !post.isSaved) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchContent = post.content?.toLowerCase().includes(q);
    const matchAuthor = post.author?.name?.toLowerCase().includes(q);
    return matchContent || matchAuthor;
  });

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Unread messages count across all conversations
  const unreadMessagesCount = useMemo(() => {
    let count = 0;
    Object.entries(conversations).forEach(([partnerId, msgs]) => {
      count += (msgs || []).filter((m) => m.senderId === partnerId && !m.read).length;
    });
    return count > 0 ? count : (activeChats.length > 0 ? 1 : 0);
  }, [conversations, activeChats.length]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Kite Navigation Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotifsOpen(!isNotifsOpen)}
        isNotifsOpen={isNotifsOpen}
        onToggleMessenger={() => {
          if (activeTab === "messages") {
            setActiveTab("feed");
          } else {
            if (!selectedChatFriendId && friends.length > 0) {
              setSelectedChatFriendId(friends[0].id);
            }
            setActiveTab("messages");
          }
        }}
        isMessengerOpen={isMessengerOpen}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Notifications Dropdown Tray */}
      <NotificationsDropdown
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotifsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* Main Layout */}
      <div
        className={`flex-1 w-full mx-auto flex justify-between ${
          activeTab === "messages"
            ? "max-w-none px-1 sm:px-4"
            : "max-w-[1920px]"
        }`}
      >
        {/* Left Navigation Rail */}
        <LeftSidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAuth={handleOpenAuth}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notesCount={notes.length}
          unreadMessagesCount={unreadMessagesCount}
        />

        {/* Central Feed / View Area */}
        <main
          className={`flex-1 min-h-[calc(100vh-4rem)] ${
            activeTab === "messages"
              ? "w-full max-w-none px-0 sm:px-2 py-2"
              : "max-w-2xl px-2 sm:px-4 py-4"
          }`}
        >
          {/* VIEW: MAIN NEWS FEED */}
          {activeTab === "feed" && (
            <div>
              {/* Stories Tray */}
              <StoriesTray
                currentUser={currentUser}
                stories={stories}
                onOpenStory={(story) => setActiveStory(story)}
                onCreateStory={() => setIsCreatePostOpen(true)}
              />

              {/* Create Post Box */}
              <CreatePostBox
                currentUser={currentUser}
                onCreatePost={handleCreatePost}
                isOpen={isCreatePostOpen}
                setIsOpen={setIsCreatePostOpen}
              />

              {/* Feed Search Indicator */}
              {searchQuery && (
                <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xs text-xs flex items-center justify-between border border-slate-200/80 dark:border-slate-800">
                  <span>
                    Searching posts for &ldquo;<strong>{searchQuery}</strong>&rdquo; ({displayedPosts.length} results)
                  </span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#1877f2] font-semibold hover:underline cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* Posts Feed */}
              {displayedPosts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center shadow-xs border border-slate-200/80 dark:border-slate-800 text-slate-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No posts to display
                  </h3>
                  <p className="text-xs mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? "Try searching for a different keyword."
                      : "Be the first to share an update or photo with your friends!"}
                  </p>
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="mt-4 px-5 py-2.5 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-xs rounded-full shadow-xs transition cursor-pointer"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                displayedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onReact={handleReactToPost}
                    onAddComment={handleAddComment}
                    onToggleSave={handleToggleSavePost}
                    onDeletePost={handleDeletePost}
                    onShare={handleSharePost}
                    onImageClick={(url) => setLightboxImage(url)}
                  />
                ))
              )}
            </div>
          )}

          {/* VIEW: SAVED POSTS */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Saved Posts
                  </h2>
                  <p className="text-xs text-slate-400">Posts and links you saved for later</p>
                </div>
                <Bookmark className="w-6 h-6 text-[#1877f2]" />
              </div>

              {displayedPosts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center shadow-xs border border-slate-200/80 dark:border-slate-800 text-slate-400">
                  <Bookmark className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">No saved posts yet</p>
                  <p className="text-xs mt-1">Bookmark posts to find them easily here.</p>
                </div>
              ) : (
                displayedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onReact={handleReactToPost}
                    onAddComment={handleAddComment}
                    onToggleSave={handleToggleSavePost}
                    onDeletePost={handleDeletePost}
                    onShare={handleSharePost}
                    onImageClick={(url) => setLightboxImage(url)}
                  />
                ))
              )}
            </div>
          )}

          {/* VIEW: FRIENDS */}
          {activeTab === "friends" && (
            <FriendsView
              friends={friends}
              friendRequests={friendRequests}
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
              onOpenChatWithFriend={handleOpenChatWithFriend}
            />
          )}

          {/* VIEW: WATCH */}
          {activeTab === "watch" && <WatchView />}

          {/* VIEW: MARKETPLACE */}
          {activeTab === "marketplace" && (
            <MarketplaceView onOpenChatWithSeller={handleOpenChatWithSeller} />
          )}

          {/* VIEW: CAREERS & JOBS */}
          {activeTab === "jobs" && (
            <JobsView
              currentUser={currentUser}
              onOpenChatWithUser={handleOpenChatWithFriend}
            />
          )}

          {/* VIEW: NOTES & SCRATCHPAD */}
          {activeTab === "notes" && (
            <NotesView
              currentUser={currentUser}
              notes={notes}
              onCreateNote={handleCreateNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onTogglePin={handleTogglePinNote}
              onToggleChecklistItem={handleToggleChecklistItem}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
            />
          )}

          {/* VIEW: MESSAGES FULL PAGE */}
          {activeTab === "messages" && (
            <MessagesView
              currentUser={currentUser}
              friends={friends}
              conversations={conversations}
              selectedFriendId={selectedChatFriendId || (friends.length > 0 ? friends[0].id : null)}
              onSelectFriend={(friend) => setSelectedChatFriendId(friend?.id || null)}
              onSendMessage={handleSendMessage}
              typingUsers={typingUsers}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
          )}
        </main>

        {/* Right Rail: Contacts and Friend Requests (Hidden on messages tab for full-screen layout) */}
        {activeTab !== "messages" && (
          <RightSidebar
            friends={friends}
            friendRequests={friendRequests}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onOpenChatWithFriend={handleOpenChatWithFriend}
            onOpenFullMessages={handleOpenFullMessages}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
          />
        )}
      </div>

      {/* Floating Messenger Chat Windows (Hidden on messages tab to avoid duplicate chat windows) */}
      {activeTab !== "messages" && (
        <FloatingMessenger
          activeChats={activeChats}
          conversations={conversations}
          currentUser={currentUser}
          onCloseChat={handleCloseChat}
          onSendMessage={handleSendMessage}
          onOpenChat={handleOpenChatWithFriend}
          friends={friends}
          typingUsers={typingUsers}
        />
      )}


      {/* Fullscreen Story Viewer Modal */}
      {activeStory && (
        <StoryViewerModal
          story={activeStory}
          stories={stories}
          onClose={() => setActiveStory(null)}
          onSelectStory={(s) => setActiveStory(s)}
          onReply={handleStoryReply}
        />
      )}

      {/* Image Lightbox Modal */}
      <ImageViewerModal
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        userPosts={posts.filter((p) => p.author?.id === currentUser?.id || p.author?.name === currentUser?.name)}
        onUpdateProfile={handleUpdateProfile}
        onReact={handleReactToPost}
        onAddComment={handleAddComment}
        onToggleSave={handleToggleSavePost}
        onDeletePost={handleDeletePost}
        onShare={handleSharePost}
      />
    </div>
  );
}
