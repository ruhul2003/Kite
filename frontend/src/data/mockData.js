export const INITIAL_CURRENT_USER = {
  id: "user-alex",
  name: "Alex Morgan",
  username: "alexmorgan",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  coverPhoto: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80",
  bio: "Fullstack Creator & Tech Enthusiast 💻 Exploring the frontier of web apps and photography 📸",
  work: "Software Engineer at Horizon Labs",
  livesIn: "San Francisco, CA",
  from: "Seattle, WA",
  joined: "March 2021",
  followersCount: 1420,
  friendsCount: 584,
  isGuest: false,
};

export const GUEST_USER_TEMPLATE = {
  id: "user-guest",
  name: "Guest Explorer",
  username: "guest_user",
  email: "guest@kite.local",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  coverPhoto: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
  bio: "Exploring Kite as a Guest ✨ Feel free to browse, like, comment, and connect!",
  work: "Guest Explorer at Kite",
  livesIn: "Everywhere",
  from: "The Internet",
  joined: "Today",
  followersCount: 12,
  friendsCount: 4,
  isGuest: true,
};

export const INITIAL_FRIENDS = [
  {
    id: "friend-sarah",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    bio: "UI/UX Designer • Visual Thinker • Coffee Lover ☕",
    online: true,
    mutualFriends: 18,
    work: "Lead Designer at Studio Pulse",
  },
  {
    id: "friend-david",
    name: "David Miller",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
    bio: "Landscape Photographer 🏔️ Wandering the globe with my camera.",
    online: true,
    mutualFriends: 7,
    work: "Freelance Photographer",
  },
  {
    id: "friend-elena",
    name: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80",
    bio: "Indie Filmmaker & Cinematographer 🎬 Storytelling through light and shadows.",
    online: false,
    lastSeen: "22m ago",
    mutualFriends: 12,
    work: "Director at Aurora Films",
  },
  {
    id: "friend-marcus",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80",
    bio: "Fitness Coach & Nutritionist 🥗 Helping people unleash their best self.",
    online: true,
    mutualFriends: 24,
    work: "Founder at PeakFit",
  },
  {
    id: "friend-chloe",
    name: "Chloe Bennett",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80",
    bio: "Travel Blogger & Podcaster ✈️ 34 countries and counting!",
    online: true,
    mutualFriends: 9,
    work: "Content Creator",
  },
  {
    id: "friend-liam",
    name: "Liam O'Connor",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    bio: "Cybersecurity Analyst & Open Source Hacker 🛡️",
    online: false,
    lastSeen: "1h ago",
    mutualFriends: 5,
    work: "Security Engineer at CyberShield",
  },
  {
    id: "friend-aisha",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
    bio: "AI Researcher & Mathematics geek 🤖 Exploring generative architectures.",
    online: true,
    mutualFriends: 15,
    work: "AI Scientist at Synthetix",
  },
];

export const INITIAL_FRIEND_REQUESTS = [
  {
    id: "req-1",
    name: "Lucas Vance",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    mutualFriends: 6,
    time: "2h ago",
  },
  {
    id: "req-2",
    name: "Maya Lin",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    mutualFriends: 14,
    time: "1d ago",
  },
  {
    id: "req-3",
    name: "Jordan Tyler",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    mutualFriends: 3,
    time: "3d ago",
  },
];

export const INITIAL_STORIES = [
  {
    id: "story-sarah",
    authorName: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    storyMedia: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    caption: "Early morning design sprint vibes ☕✨",
    timestamp: "2h ago",
    viewed: false,
  },
  {
    id: "story-david",
    authorName: "David Miller",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    storyMedia: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    caption: "Yosemite sunrise hike was unreal 🏔️🌄",
    timestamp: "4h ago",
    viewed: false,
  },
  {
    id: "story-marcus",
    authorName: "Marcus Johnson",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    storyMedia: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    caption: "Leg day done. No excuses! 💪🔥",
    timestamp: "6h ago",
    viewed: false,
  },
  {
    id: "story-chloe",
    authorName: "Chloe Bennett",
    authorAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    storyMedia: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80",
    caption: "Road trip along the Pacific Coast Highway 🌊🚙",
    timestamp: "8h ago",
    viewed: false,
  },
  {
    id: "story-aisha",
    authorName: "Aisha Patel",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    storyMedia: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    caption: "Late night lab experiments pay off 🤖💡",
    timestamp: "11h ago",
    viewed: true,
  },
];

export const KITE_REACTIONS = [
  { id: "spark", label: "Like", emoji: "👍", color: "text-[#1877f2]", bg: "hover:bg-[#1877f2]/10" },
  { id: "insight", label: "Insight", emoji: "💡", color: "text-[#1877f2]", bg: "hover:bg-[#1877f2]/10" },
  { id: "fire", label: "Celebrate", emoji: "🎉", color: "text-[#1877f2]", bg: "hover:bg-[#1877f2]/10" },
  { id: "vibe", label: "Love", emoji: "❤️", color: "text-[#1877f2]", bg: "hover:bg-[#1877f2]/10" },
];

export const VIBE_STATUSES = [
  { id: "building", emoji: "💻", label: "Building", color: "text-slate-600 dark:text-slate-400" },
  { id: "focus", emoji: "💼", label: "Focused", color: "text-slate-600 dark:text-slate-400" },
  { id: "available", emoji: "✨", label: "Available", color: "text-slate-600 dark:text-slate-400" },
];

export const DAILY_SPARK_PROMPT = {
  id: "daily-spark-today",
  tag: "Discussion of the Day",
  question: "What is one counter-intuitive lesson you learned in your craft this year?",
  author: "Kite Community",
  sparksCount: 42,
};

export const SOUNDSCAPE_TRACKS = [];

export const INITIAL_POSTS = [
  {
    id: "post-1",
    author: {
      id: "friend-sarah",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      role: "Product Designer",
      vibe: "🎨 Creative Flow",
    },
    timestamp: "18 mins ago",
    privacy: "public",
    vibeTag: "audio",
    feeling: { emoji: "🎙️", text: "recorded an Audio Spark" },
    content: "Took a walk by the waterfront without my phone notifications. Recorded this quick 35s voice note on why high-velocity design sprints often fail when teams don't pause to synthesize.\n\nTake a listen and let me know your take below! 👇",
    audioSpark: {
      title: "The Silent Cost of Never Pausing",
      duration: "0:35",
      recordedAt: "Today",
      waves: [24, 45, 68, 80, 52, 90, 60, 40, 75, 95, 80, 60, 45, 30, 60, 85, 70, 40, 55, 30, 20],
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1000&auto=format&fit=crop&q=80",
        caption: "Golden Gate Bridge at dusk",
      },
    ],
    reactions: {
      spark: 38,
      insight: 52,
      fire: 14,
      vibe: 29,
      liftoff: 8,
      zen: 41,
    },
    userReaction: "insight",
    sharesCount: 12,
    isSaved: true,
    comments: [
      {
        id: "c-1",
        author: {
          name: "David Miller",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        },
        content: "That voice spark resonated so hard Sarah. 'Motion is not progress' — writing that down on my whiteboard.",
        timestamp: "12 mins ago",
        likes: 6,
        isLiked: true,
      },
      {
        id: "c-2",
        author: {
          name: "Alex Morgan",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
        content: "Audio notes on Kite make conversations feel so much more genuine than plain walls of text. Love this!",
        timestamp: "5 mins ago",
        likes: 3,
        isLiked: false,
      },
    ],
  },
  {
    id: "post-2",
    author: {
      id: "friend-liam",
      name: "Liam O'Connor",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      role: "Systems Architect",
      vibe: "⚡ Building",
    },
    timestamp: "1 hour ago",
    privacy: "public",
    vibeTag: "code",
    feeling: { emoji: "💻", text: "sharing code snippet" },
    content: "Facebook and legacy social apps strip out all code indentation. On Kite we treat code as a first-class creative medium!\n\nHere's a lightweight React 19 pattern for an optimistic async queue with automatic rollback:",
    codeSnippet: {
      language: "typescript",
      filename: "useOptimisticQueue.ts",
      code: `export function useOptimisticQueue<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const rollbackRef = useRef<T[]>(initialItems);

  const applySpark = async (newItem: T, asyncAction: () => Promise<void>) => {
    rollbackRef.current = items;
    setItems((prev) => [newItem, ...prev]); // Instant optimistic update

    try {
      await asyncAction();
    } catch (err) {
      setItems(rollbackRef.current); // Graceful rollback
      console.warn("Rollback applied:", err);
    }
  };

  return { items, applySpark };
}`,
    },
    reactions: {
      spark: 84,
      insight: 67,
      fire: 49,
      vibe: 12,
      liftoff: 33,
      zen: 9,
    },
    userReaction: "spark",
    sharesCount: 26,
    isSaved: false,
    comments: [
      {
        id: "c-3",
        author: {
          name: "Aisha Patel",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        },
        content: "Clean implementation! Love having syntax highlighting directly in the social stream.",
        timestamp: "45 mins ago",
        likes: 8,
        isLiked: false,
      },
    ],
  },
  {
    id: "post-3",
    author: {
      id: "friend-aisha",
      name: "Aisha Patel",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      role: "AI Scientist",
      vibe: "💡 Seeking insights",
    },
    timestamp: "3 hours ago",
    privacy: "public",
    vibeTag: "poll",
    feeling: { emoji: "📊", text: "running a Vibe Poll" },
    content: "Quick poll for everyone here! We're building the future of digital community spaces on Kite. Which feature matters most to your mental well-being online?",
    poll: {
      id: "poll-social-health",
      question: "Which feature protects your creative focus the most?",
      totalVotes: 328,
      userVotedOptionId: "opt-1",
      options: [
        { id: "opt-1", text: "Zen Mode (Hiding all vanity like & follower counts)", votes: 164, percentage: 50 },
        { id: "opt-2", text: "Built-in ambient soundscape while reading", votes: 72, percentage: 22 },
        { id: "opt-3", text: "Audio voice sparks instead of endless comment flames", votes: 59, percentage: 18 },
        { id: "opt-4", text: "Native syntax-highlighted code & markdown blocks", votes: 33, percentage: 10 },
      ],
    },
    reactions: {
      spark: 45,
      insight: 91,
      fire: 16,
      vibe: 38,
      liftoff: 19,
      zen: 62,
    },
    userReaction: "zen",
    sharesCount: 18,
    isSaved: true,
    comments: [
      {
        id: "c-4",
        author: {
          name: "Chloe Bennett",
          avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        },
        content: "Voted Zen Mode! Being able to read thoughts without seeing who got 1,000 likes completely changes the psychological feeling.",
        timestamp: "2 hours ago",
        likes: 14,
        isLiked: true,
      },
    ],
  },
  {
    id: "post-4",
    author: {
      id: "friend-marcus",
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      role: "Holistic Health Coach",
      vibe: "🌿 Mindful Zen",
    },
    timestamp: "5 hours ago",
    privacy: "public",
    vibeTag: "zen",
    feeling: { emoji: "🥗", text: "sharing recipe" },
    content: "Weekly nourishing meal prep! Wild Alaskan salmon, roasted rainbow carrots, quinoa, and homemade lemon tahini dressing.\n\nDrop a comment or audio spark if you want the 5-minute dressing recipe! 👇",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80",
        caption: "Healthy colorful salmon grain bowl",
      },
    ],
    reactions: {
      spark: 28,
      insight: 15,
      fire: 73,
      vibe: 44,
      liftoff: 5,
      zen: 82,
    },
    userReaction: "fire",
    sharesCount: 14,
    isSaved: false,
    comments: [],
  },
  {
    id: "post-5",
    author: {
      id: "friend-david",
      name: "David Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isVerified: false,
      role: "Visual Storyteller",
      vibe: "🎨 Creative Flow",
    },
    timestamp: "7 hours ago",
    privacy: "public",
    vibeTag: "creative",
    bgGradient: "from-indigo-900 via-purple-900 to-slate-900",
    content: "“Creativity is not a talent. It is a state of play where you allow yourself to fail with elegance.”\n\nWhat are you crafting today? 🚀✨",
    media: [],
    reactions: {
      spark: 61,
      insight: 79,
      fire: 24,
      vibe: 53,
      liftoff: 18,
      zen: 34,
    },
    userReaction: "vibe",
    sharesCount: 31,
    isSaved: false,
    comments: [],
  },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    type: "reaction",
    text: "loved your latest photo.",
    timestamp: "12m ago",
    read: false,
  },
  {
    id: "notif-2",
    author: {
      name: "David Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    type: "comment",
    text: 'commented on your post: "Stunning capture! What lens did you use?"',
    timestamp: "45m ago",
    read: false,
  },
  {
    id: "notif-3",
    author: {
      name: "Lucas Vance",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
    type: "friend_request",
    text: "sent you a friend request.",
    timestamp: "2h ago",
    read: false,
  },
  {
    id: "notif-4",
    author: {
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    type: "mention",
    text: "mentioned you in a post in Tech Enthusiasts.",
    timestamp: "5h ago",
    read: true,
  },
  {
    id: "notif-5",
    author: {
      name: "Aisha Patel",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
    type: "group",
    text: "shared a new link in AI Researchers Club.",
    timestamp: "1d ago",
    read: true,
  },
];

export const INITIAL_CONVERSATIONS = {
  "friend-sarah": [
    { id: "m-1", senderId: "friend-sarah", text: "Hey! Did you check out the new design system update?", time: "10:14 AM" },
    { id: "m-2", senderId: "user-alex", text: "Yes! Loved the audio sparks and calm Zen mode. Truly feels like a fresh creative sanctuary.", time: "10:16 AM" },
    { id: "m-3", senderId: "friend-sarah", text: "Awesome! Let me know if you want to collaborate on the stories carousel next.", time: "10:18 AM" },
  ],
  "friend-david": [
    { id: "m-4", senderId: "friend-david", text: "Hey, are you free for a photo walk this Sunday at Baker Beach?", time: "Yesterday" },
    { id: "m-5", senderId: "user-alex", text: "Sounds fun! Around golden hour at 5 PM?", time: "Yesterday" },
    { id: "m-6", senderId: "friend-david", text: "Perfect timing. Bringing the 35mm prime lens!", time: "Yesterday" },
  ],
  "friend-marcus": [
    { id: "m-7", senderId: "friend-marcus", text: "Don't forget to hydrate today! How was the morning workout?", time: "2 days ago" },
    { id: "m-8", senderId: "user-alex", text: "Got 5k in before breakfast! Feeling energized.", time: "2 days ago" },
  ],
};

export const INITIAL_MARKETPLACE = [
  {
    id: "item-1",
    title: "Sony Alpha A7 IV (Body Only, Mint)",
    price: "$1,850",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    seller: "David Miller",
    category: "Electronics",
    time: "2 days ago",
  },
  {
    id: "item-2",
    title: "MacBook Pro 16\" M3 Max - 36GB / 1TB",
    price: "$2,450",
    location: "Oakland, CA",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    seller: "Sarah Chen",
    category: "Computers",
    time: "3 days ago",
  },
  {
    id: "item-3",
    title: "Herman Miller Aeron Chair (Size B)",
    price: "$520",
    location: "San Jose, CA",
    image: "https://images.unsplash.com/photo-1580481077195-c328ad4f4f72?w=600&auto=format&fit=crop&q=80",
    seller: "Lucas Vance",
    category: "Furniture",
    time: "Yesterday",
  },
  {
    id: "item-4",
    title: "Vintage Fuji Road Bike (54cm Shimano 105)",
    price: "$380",
    location: "Berkeley, CA",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    seller: "Chloe Bennett",
    category: "Bicycles",
    time: "4 days ago",
  },
  {
    id: "item-5",
    title: "Keychron Q1 Pro Custom Mechanical Keyboard",
    price: "$165",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    seller: "Liam O'Connor",
    category: "Electronics",
    time: "Just now",
  },
  {
    id: "item-6",
    title: "Monstera Deliciosa Large Indoor Plant + Ceramic Pot",
    price: "$45",
    location: "Palo Alto, CA",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80",
    seller: "Elena Rostova",
    category: "Garden",
    time: "5 hours ago",
  },
];

export const INITIAL_WATCH = [
  {
    id: "video-1",
    title: "10 Minimalist Desk Setups That Boost Productivity (2026 Tour)",
    channel: "Design Sprout",
    views: "240K views",
    timestamp: "3 days ago",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    duration: "14:22",
  },
  {
    id: "video-2",
    title: "Hidden Gems of Northern California: Solo Hiking & Photography",
    channel: "David Miller Wanderer",
    views: "89K views",
    timestamp: "1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    duration: "21:05",
  },
  {
    id: "video-3",
    title: "How to Cook The Perfect Pan-Seared Salmon Every Time",
    channel: "Chef Marcus Fitness",
    views: "512K views",
    timestamp: "5 days ago",
    thumbnail: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    duration: "08:44",
  },
  {
    id: "video-4",
    title: "Autonomous AI Agents in 15 Minutes — What You Need to Know",
    channel: "Tech Frontier",
    views: "1.2M views",
    timestamp: "2 weeks ago",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    duration: "15:30",
  },
];

export const FEELING_PRESETS = [
  { emoji: "😊", text: "feeling happy" },
  { emoji: "🎉", text: "celebrating" },
  { emoji: "🚀", text: "feeling inspired" },
  { emoji: "🥰", text: "feeling loved" },
  { emoji: "🍕", text: "eating delicious food" },
  { emoji: "✈️", text: "traveling to" },
  { emoji: "🎧", text: "listening to music" },
  { emoji: "💻", text: "working hard" },
  { emoji: "😴", text: "feeling sleepy" },
  { emoji: "💪", text: "working out" },
];

export const COLOR_BACKGROUNDS = [
  { id: "none", name: "Clean Minimal", class: "bg-white text-zinc-900 dark:bg-[#111827] dark:text-[#f1f5f9]" },
  { id: "bg-primary", name: "Brand Blue", class: "bg-[#1877f2] text-white font-bold text-center text-xl sm:text-2xl p-8 flex items-center justify-center min-h-[200px]" },
  { id: "bg-slate", name: "Slate Dark", class: "bg-slate-900 text-white font-bold text-center text-xl sm:text-2xl p-8 flex items-center justify-center min-h-[200px]" },
];
