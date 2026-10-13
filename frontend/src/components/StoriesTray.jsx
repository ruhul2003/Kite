"use client";

import { useState, useRef } from "react";
import { Plus, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

export default function StoriesTray({ currentUser, stories, onOpenStory, onCreateStory }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative mb-4 select-none">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Stories Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1 scroll-smooth"
      >
        {/* Create Story Card */}
        <div
          onClick={onCreateStory}
          className="relative w-28 sm:w-32 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0 cursor-pointer group flex flex-col justify-between hover:shadow-md transition"
        >
          <div className="h-[72%] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={currentUser?.coverPhoto || currentUser?.avatar}
              alt="Create Story"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Plus Button in center */}
          <div className="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1877f2] hover:bg-[#166fe5] border-4 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-sm transition">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="h-[28%] flex items-end justify-center pb-2.5 px-1 text-center bg-white dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              Create Story
            </span>
          </div>
        </div>

        {/* Stories List */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onOpenStory(story)}
            className="relative w-28 sm:w-32 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-xs shrink-0 cursor-pointer group hover:shadow-md transition"
          >
            <img
              src={story.storyMedia}
              alt={story.authorName}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

            {/* Author Avatar with clean primary border */}
            <div className="absolute top-3 left-3">
              <div className="w-9 h-9 rounded-full ring-2 ring-[#1877f2] p-0.5 bg-white dark:bg-slate-900">
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Caption Preview & Author Name */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="text-xs font-semibold truncate drop-shadow-sm">
                {story.authorName}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
