"use client";

import { useState, useRef } from "react";
import { Plus, ChevronRight, ChevronLeft } from "lucide-react";

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
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#3a3b3c] shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:scale-105 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Stories Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1 scroll-smooth"
      >
        {/* CREATE STORY CARD */}
        <div
          onClick={onCreateStory}
          className="relative w-28 sm:w-32 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#242526] border border-zinc-200 dark:border-zinc-700/60 shrink-0 cursor-pointer group flex flex-col justify-between hover:shadow-md transition transform hover:-translate-y-0.5"
        >
          {/* Top image (User Avatar / Cover) */}
          <div className="h-[72%] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={currentUser?.coverPhoto || currentUser?.avatar}
              alt="Create Story"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Plus Button in center */}
          <div className="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1877f2] border-4 border-white dark:border-[#242526] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>

          {/* Bottom Label */}
          <div className="h-[28%] flex items-end justify-center pb-2 px-1 text-center bg-white dark:bg-[#242526]">
            <span className="text-xs font-bold text-zinc-900 dark:text-[#e4e6eb] truncate">
              Create story
            </span>
          </div>
        </div>

        {/* FRIEND STORIES */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onOpenStory(story)}
            className="relative w-28 sm:w-32 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-sm shrink-0 cursor-pointer group hover:shadow-md transition transform hover:-translate-y-0.5"
          >
            {/* Story Background Image */}
            <img
              src={story.storyMedia}
              alt={story.authorName}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75 group-hover:from-black/50 group-hover:to-black/85 transition" />

            {/* Author Avatar with glowing blue border */}
            <div className="absolute top-3 left-3">
              <div className="w-10 h-10 rounded-full p-0.5 bg-[#1877f2] ring-2 ring-white/80 shadow-md">
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Caption Preview & Author Name */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
              <p className="text-xs font-bold truncate drop-shadow-md">
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
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#3a3b3c] shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:scale-105 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
