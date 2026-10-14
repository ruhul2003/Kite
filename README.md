# Kite — Modern Social Platform

Kite is a full-featured, responsive social platform inspired by Facebook, built with Next.js 16, Tailwind CSS v4, and Node.js Express with MongoDB.

## Features

- **Authentication & Guest Access**:
  - Full Sign Up & Log In system
  - 1-Click "Continue as Guest" mode with instant access to the news feed
  - Switch accounts and profile management
- **News Feed & Posts**:
  - Interactive post creation with colorful Facebook gradient backgrounds, photo attachments, and feeling/activity indicators
  - Facebook reaction bar with animated emojis (Like 👍, Love ❤️, Care 🥰, Haha 😂, Wow 😮, Sad 😢, Angry 😡)
  - Nested comments system with instant commenting
  - Post bookmarking, sharing, and deletion
- **Stories**:
  - Horizontal stories tray with "Create Story" tile
  - Fullscreen story viewer modal with automated progress bar timer, quick reactions, and direct replies
- **Messenger & Chat**:
  - Bottom-right floating Messenger chat docks
  - Active online status indicators
  - Instant messaging with simulated conversational auto-replies
- **Dedicated Hubs**:
  - Friends hub with incoming friend requests (Accept/Decline) and all friends grid
  - Watch hub with trending video reels and previews
  - Marketplace with categories and item listings
  - Careers & Jobs hub with job postings, applicant tracking, and direct application workflow
  - **My Notes & Scratchpad**:
    - Fullstack personal note-taking hub with MongoDB persistence and offline fallback
    - Rich pastel and dark-mode color themes (Slate, Amber, Emerald, Sky, Purple, Rose)
    - Interactive todo checklists with real-time checkbox toggles and completion indicators
    - Category filtering (All, Work, Personal, Ideas, Code, Todo) and tag search
    - Pinned notes organization keeping priority items anchored to the top
    - 1-Click "Convert Note to Feed Post" and clipboard copy tools
- **Modern UI & Aesthetics**:
  - Facebook-inspired responsive 3-column desktop and mobile-friendly design
  - Dark Mode & Light Mode toggle
  - Image lightbox modal

## Getting Started

### 1. Frontend (Next.js)

```bash
cd frontend
npm run dev
```

The frontend runs on [http://localhost:3000](http://localhost:3000).

### 2. Backend (Node.js + Express + MongoDB)

```bash
cd backend
npm run dev
```

The backend server runs on [http://localhost:5000](http://localhost:5000).
Ensure `MONGODB_URI` is configured in `backend/.env`.
