"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import StoriesTray from "../components/StoriesTray";
import CreatePostBox from "../components/CreatePostBox";
import PostCard from "../components/PostCard";
import { useRouter } from "next/navigation";
import { apiCreatePost } from "../utils/api";
import StoryViewerModal from "../components/StoryViewerModal";
import ProfileModal from "../components/ProfileModal";
import ImageViewerModal from "../components/ImageViewerModal";
import FloatingMessenger from "../components/FloatingMessenger";
import NotificationsDropdown from "../components/NotificationsDropdown";
import FriendsView from "../components/FriendsView";
import WatchView from "../components/WatchView";
import MarketplaceView from "../components/MarketplaceView";
import JobsView from "../components/JobsView";
import {
  INITIAL_CURRENT_USER,
  GUEST_USER_TEMPLATE,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_FRIENDS,
  INITIAL_FRIEND_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
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

  // Modals & Panels State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [activeChats, setActiveChats] = useState([]); // List of friend objects with open chat windows

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
    if (!activeChats.find((c) => c.id === friend.id)) {
      setActiveChats([...activeChats, friend]);
    }
  };

  const handleOpenChatWithSeller = (sellerName) => {
    const existing = friends.find((f) => f.name.toLowerCase() === sellerName.toLowerCase());
    const target = existing || {
      id: `seller-${Date.now()}`,
      name: sellerName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      online: true,
    };
    handleOpenChatWithFriend(target);
  };

  const handleCloseChat = (friendId) => {
    setActiveChats(activeChats.filter((c) => c.id !== friendId));
  };

  const handleSendMessage = (friendId, text) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), userMsg],
    }));

    // Friendly auto-reply simulation
    setTimeout(() => {
      const replies = [
        "Loved that voice spark you shared earlier! ✨",
        "Totally agree with you on this! The Zen mode is so peaceful.",
        "Thanks for the note! Really enjoying the new Kite interface.",
        "Brilliant idea. Let's collaborate on this circle project soon! 🚀",
        "Got it, appreciate the message! 🍵",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const friendMsg = {
        id: `reply-${Date.now()}`,
        senderId: friendId,
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) => ({
        ...prev,
        [friendId]: [...(prev[friendId] || []), friendMsg],
      }));
    }, 1200);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Kite Navigation Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={activeChats.length > 0 ? 1 : 0}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotifsOpen(!isNotifsOpen)}
        isNotifsOpen={isNotifsOpen}
        onToggleMessenger={() => {
          if (activeChats.length === 0 && friends.length > 0) {
            handleOpenChatWithFriend(friends[0]);
          }
          setIsMessengerOpen(!isMessengerOpen);
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
      <div className="flex-1 max-w-[1920px] w-full mx-auto flex justify-between">
        {/* Left Navigation Rail */}
        <LeftSidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAuth={handleOpenAuth}
        />

        {/* Central Feed / View Area */}
        <main className="flex-1 max-w-2xl px-2 sm:px-4 py-4 min-h-[calc(100vh-4rem)]">
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
        </main>

        {/* Right Rail: Contacts and Friend Requests */}
        <RightSidebar
          friends={friends}
          friendRequests={friendRequests}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
          onOpenChatWithFriend={handleOpenChatWithFriend}
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
        />
      </div>

      {/* Floating Direct Whisper Chat Windows */}
      <FloatingMessenger
        activeChats={activeChats}
        conversations={conversations}
        currentUser={currentUser}
        onCloseChat={handleCloseChat}
        onSendMessage={handleSendMessage}
        onOpenChat={handleOpenChatWithFriend}
        friends={friends}
      />


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
