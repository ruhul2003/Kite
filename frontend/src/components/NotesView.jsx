"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  StickyNote,
  Pin,
  CheckSquare,
  Palette,
  Tag,
  Trash2,
  X,
  Check,
  Copy,
  Share2,
  Edit3,
} from "lucide-react";

export const NOTE_THEMES = {
  slate: {
    bg: "bg-white dark:bg-slate-900",
    border: "border-slate-200/80 dark:border-slate-800",
    accent: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    name: "Clean Slate",
    dot: "bg-slate-400",
  },
  amber: {
    bg: "bg-amber-50/70 dark:bg-amber-950/20",
    border: "border-amber-200/80 dark:border-amber-900/50",
    accent: "bg-amber-100/80 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300",
    name: "Amber Warm",
    dot: "bg-amber-500",
  },
  emerald: {
    bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
    border: "border-emerald-200/80 dark:border-emerald-900/50",
    accent: "bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300",
    name: "Emerald Mint",
    dot: "bg-emerald-500",
  },
  sky: {
    bg: "bg-sky-50/70 dark:bg-sky-950/20",
    border: "border-sky-200/80 dark:border-sky-900/50",
    accent: "bg-sky-100/80 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300",
    name: "Sky Breeze",
    dot: "bg-sky-500",
  },
  purple: {
    bg: "bg-purple-50/70 dark:bg-purple-950/20",
    border: "border-purple-200/80 dark:border-purple-900/50",
    accent: "bg-purple-100/80 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300",
    name: "Orchid Purple",
    dot: "bg-purple-500",
  },
  rose: {
    bg: "bg-rose-50/70 dark:bg-rose-950/20",
    border: "border-rose-200/80 dark:border-rose-900/50",
    accent: "bg-rose-100/80 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300",
    name: "Rose Blush",
    dot: "bg-rose-500",
  },
};

export default function NotesView({
  currentUser,
  notes = [],
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onTogglePin,
  onToggleChecklistItem,
  onOpenCreatePost,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // New Note Builder Form State
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newColor, setNewColor] = useState("slate");
  const [newCategory, setNewCategory] = useState("General");
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [newTagsString, setNewTagsString] = useState("");
  const [checklistMode, setChecklistMode] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistInput, setNewChecklistInput] = useState("");

  // Edit Note Modal & Copy Feedback State
  const [editingNote, setEditingNote] = useState(null);
  const [copiedNoteId, setCopiedNoteId] = useState(null);

  const CATEGORIES = ["All", "Work", "Personal", "Ideas", "Code", "Todo"];

  const handleAddChecklistItem = () => {
    if (!newChecklistInput.trim()) return;
    setChecklistItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}-${prev.length}`, text: newChecklistInput.trim(), completed: false },
    ]);
    setNewChecklistInput("");
  };

  const handleRemoveChecklistItem = (id) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter notes according to search, category, and selected tag
  const filteredNotes = notes.filter((note) => {
    if (activeCategory !== "All" && note.category !== activeCategory) {
      return false;
    }

    if (selectedTag && (!note.tags || !note.tags.includes(selectedTag))) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = note.title?.toLowerCase().includes(q);
      const inContent = note.content?.toLowerCase().includes(q);
      const inTags = note.tags?.some((t) => t.toLowerCase().includes(q));
      const inChecklist = note.checklist?.some((c) => c.text.toLowerCase().includes(q));
      if (!inTitle && !inContent && !inTags && !inChecklist) return false;
    }

    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  const renderNoteCard = (note) => {
    const theme = NOTE_THEMES[note.color] || NOTE_THEMES.slate;

    return (
      <div
        key={note.id || note._id}
        className={`group relative p-4 sm:p-5 rounded-3xl transition-all duration-200 border shadow-xs hover:shadow-md flex flex-col justify-between ${theme.bg} ${theme.border}`}
      >
        <div>
          {/* Card Top Row: Category badge & Pin Toggle */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${theme.accent}`}
            >
              {note.category || "General"}
            </span>

            <button
              onClick={() => onTogglePin?.(note.id || note._id)}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                note.isPinned
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100"
              }`}
              title={note.isPinned ? "Unpin note" : "Pin note to top"}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mb-1.5">
            {note.title}
          </h3>

          {/* Content */}
          {note.content && (
            <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-4 mb-3">
              {note.content}
            </p>
          )}

          {/* Interactive Checklist on Card */}
          {note.checklist && note.checklist.length > 0 && (
            <div className="space-y-1.5 mb-3 pt-2 border-t border-black/5 dark:border-white/5">
              {note.checklist.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleChecklistItem?.(note.id || note._id, item.id, !item.completed);
                  }}
                  className="flex items-center gap-2 text-xs group/item cursor-pointer select-none"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition shrink-0 ${
                      item.completed
                        ? "bg-[#1877f2] border-[#1877f2] text-white"
                        : "border-slate-300 dark:border-slate-600 group-hover/item:border-[#1877f2]"
                    }`}
                  >
                    {item.completed && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span
                    className={`truncate transition text-slate-700 dark:text-slate-300 ${
                      item.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
              {note.checklist.length > 5 && (
                <p className="text-[10px] text-slate-400 pl-5">
                  +{note.checklist.length - 5} more checklist items
                </p>
              )}
            </div>
          )}

          {/* Tag Chips */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {note.tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTag(tag);
                  }}
                  className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[10px] font-semibold text-slate-600 dark:text-slate-400 transition cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer Actions & Timestamp */}
        <div className="pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400">
          <span>
            {note.updatedAt
              ? new Date(note.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })
              : "Recent"}
          </span>

          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
            {/* Copy Note to Clipboard */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const noteId = note.id || note._id;
                let textToCopy = `${note.title}\n\n${note.content || ""}`;
                if (note.checklist && note.checklist.length > 0) {
                  textToCopy += "\n\nChecklist:\n" + note.checklist.map((c) => `[${c.completed ? "x" : " "}] ${c.text}`).join("\n");
                }
                navigator.clipboard?.writeText(textToCopy);
                setCopiedNoteId(noteId);
                setTimeout(() => setCopiedNoteId(null), 2000);
              }}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              title="Copy note text to clipboard"
            >
              {copiedNoteId === (note.id || note._id) ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Convert Note to Feed Post */}
            {onOpenCreatePost && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  let postText = `📌 [Note: ${note.title}]\n\n${note.content || ""}`;
                  if (note.tags && note.tags.length > 0) {
                    postText += "\n\n" + note.tags.map((t) => `#${t}`).join(" ");
                  }
                  onOpenCreatePost({ initialText: postText });
                }}
                className="p-1.5 rounded-lg hover:bg-[#1877f2]/10 text-slate-400 hover:text-[#1877f2] transition cursor-pointer"
                title="Convert note into a Kite feed post"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Edit Note */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingNote({
                  ...note,
                  tagsString: note.tags?.join(", ") || "",
                });
              }}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              title="Edit note"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Note */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote?.(note.id || note._id);
              }}
              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition cursor-pointer"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-[#1877f2]/10 to-purple-500/10 dark:from-indigo-500/20 dark:via-[#1877f2]/20 dark:to-purple-500/20 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1877f2]/10 text-[#1877f2] dark:text-[#60a5fa] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Knowledge & Scratchpad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Notes & Ideas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
              Capture quick thoughts, manage checklists, store code snippets, or convert notes into Kite feed posts anytime.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#1877f2] text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#1877f2] text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes, checklists, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1877f2] shadow-2xs backdrop-blur-sm transition"
          />
        </div>

        {/* Category Pills & Active Tag Filter */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedTag(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-[#1877f2] text-white shadow-xs font-bold"
                    : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {cat}
              </button>
            );
          })}

          {selectedTag && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-xs font-bold whitespace-nowrap">
              <span>#{selectedTag}</span>
              <button
                onClick={() => setSelectedTag(null)}
                className="hover:text-purple-800 dark:hover:text-purple-200 cursor-pointer"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Note Creator Card */}
      <div
        className={`mb-8 p-4 sm:p-5 rounded-3xl transition-all duration-200 border shadow-sm ${
          NOTE_THEMES[newColor].bg
        } ${NOTE_THEMES[newColor].border}`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Note title (e.g., Sprint Launch Checklist, Project Idea)..."
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (!isFormExpanded) setIsFormExpanded(true);
              }}
              onFocus={() => setIsFormExpanded(true)}
              className="w-full text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-hidden"
            />

            <button
              onClick={() => setNewIsPinned(!newIsPinned)}
              className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                newIsPinned
                  ? "bg-[#1877f2] text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
              title={newIsPinned ? "Pinned to top" : "Pin note to top"}
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>

          <textarea
            placeholder="Jot down details, thoughts, code snippets, or markdown..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onFocus={() => setIsFormExpanded(true)}
            rows={isFormExpanded ? 3 : 2}
            className="w-full text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 bg-transparent focus:outline-hidden resize-none scrollbar-thin"
          />

          {/* Interactive Checklist Mode */}
          {checklistMode && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#1877f2]" />
                <span>Todo Checklist ({checklistItems.length})</span>
              </p>

              <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-3.5 h-3.5 rounded-sm border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                        {item.completed && <Check className="w-2.5 h-2.5 text-[#1877f2]" />}
                      </span>
                      <span className={`truncate text-slate-800 dark:text-slate-200 ${item.completed ? "line-through text-slate-400" : ""}`}>
                        {item.text}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a checklist item (press Enter)..."
                  value={newChecklistInput}
                  onChange={(e) => setNewChecklistInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden"
                />
                <button
                  onClick={handleAddChecklistItem}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-[#1877f2] hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Expandable Tools (Color Palette, Category, Tags, Checklist Toggle) */}
          {isFormExpanded && (
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Color Palette Picker */}
                <div className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  {Object.keys(NOTE_THEMES).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() => setNewColor(themeKey)}
                      className={`w-6 h-6 rounded-full transition cursor-pointer flex items-center justify-center ${
                        NOTE_THEMES[themeKey].dot
                      } ${
                        newColor === themeKey
                          ? "ring-2 ring-offset-2 ring-[#1877f2] scale-110"
                          : "opacity-75 hover:opacity-100"
                      }`}
                      title={NOTE_THEMES[themeKey].name}
                    />
                  ))}
                </div>

                {/* Category Selector & Checklist Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChecklistMode(!checklistMode)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      checklistMode
                        ? "bg-[#1877f2]/10 text-[#1877f2] font-bold"
                        : "bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Checklist</span>
                  </button>

                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Ideas">Ideas</option>
                    <option value="Code">Code</option>
                    <option value="Todo">Todo</option>
                  </select>
                </div>
              </div>

              {/* Tags Input */}
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Tags (comma separated, e.g. Design, NextJS, Sprint)..."
                  value={newTagsString}
                  onChange={(e) => setNewTagsString(e.target.value)}
                  className="w-full text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">
              {newIsPinned ? "📌 Will be pinned to top" : "Personal & private to you"}
            </span>
            <div className="flex items-center gap-2">
              {isFormExpanded && (
                <button
                  onClick={() => {
                    setIsFormExpanded(false);
                    setNewTitle("");
                    setNewContent("");
                    setChecklistItems([]);
                    setChecklistMode(false);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (!newTitle.trim()) return;
                  const tags = newTagsString
                    .split(",")
                    .map((t) => t.trim().replace(/^#/, ""))
                    .filter(Boolean);

                  if (onCreateNote) {
                    onCreateNote({
                      title: newTitle.trim(),
                      content: newContent.trim(),
                      color: newColor,
                      category: newCategory,
                      isPinned: newIsPinned,
                      tags,
                      checklist: checklistItems,
                    });
                  }

                  // Reset form
                  setNewTitle("");
                  setNewContent("");
                  setNewTagsString("");
                  setChecklistItems([]);
                  setChecklistMode(false);
                  setIsFormExpanded(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Notes Sections */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center mx-auto mb-3">
            <StickyNote className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No notes found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || activeCategory !== "All" || selectedTag
              ? "Try adjusting your search terms or clearing the active category filters."
              : "Capture your first quick thought, coding snippet, or sprint checklist above!"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Pin className="w-3.5 h-3.5 text-[#1877f2]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pinned Notes ({pinnedNotes.length})
                </h2>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    : "space-y-3"
                }
              >
                {pinnedNotes.map((note) => renderNoteCard(note))}
              </div>
            </div>
          )}

          {/* Other Notes Section */}
          {otherNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div className="flex items-center gap-2 mb-3 px-1">
                  <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Other Notes ({otherNotes.length})
                  </h2>
                </div>
              )}

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    : "space-y-3"
                }
              >
                {otherNotes.map((note) => renderNoteCard(note))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border ${
              NOTE_THEMES[editingNote.color || "slate"].bg
            } ${NOTE_THEMES[editingNote.color || "slate"].border}`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#1877f2]" />
                <span>Edit Note</span>
              </h3>
              <button
                onClick={() => setEditingNote(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Content
                </label>
                <textarea
                  rows={4}
                  value={editingNote.content || ""}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, content: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1877f2] resize-none"
                />
              </div>

              {/* Color & Category */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5">
                  {Object.keys(NOTE_THEMES).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() =>
                        setEditingNote({ ...editingNote, color: themeKey })
                      }
                      className={`w-6 h-6 rounded-full transition cursor-pointer ${
                        NOTE_THEMES[themeKey].dot
                      } ${
                        editingNote.color === themeKey
                          ? "ring-2 ring-offset-2 ring-[#1877f2] scale-110"
                          : "opacity-75 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>

                <select
                  value={editingNote.category || "General"}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, category: e.target.value })
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Ideas">Ideas</option>
                  <option value="Code">Code</option>
                  <option value="Todo">Todo</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editingNote.tagsString || ""}
                  onChange={(e) =>
                    setEditingNote({
                      ...editingNote,
                      tagsString: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 mt-4 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => setEditingNote(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const tags = (editingNote.tagsString || "")
                    .split(",")
                    .map((t) => t.trim().replace(/^#/, ""))
                    .filter(Boolean);

                  onUpdateNote?.(editingNote.id || editingNote._id, {
                    title: editingNote.title.trim(),
                    content: editingNote.content.trim(),
                    color: editingNote.color,
                    category: editingNote.category,
                    tags,
                  });

                  setEditingNote(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
