"use client";

import { useState } from "react";
import { Search, MapPin, Tag, MessageCircle } from "lucide-react";
import { INITIAL_MARKETPLACE } from "../data/mockData";

export default function MarketplaceView({ onOpenChatWithSeller }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Electronics", "Computers", "Furniture", "Bicycles", "Garden"];

  const filteredItems = INITIAL_MARKETPLACE.filter((item) => {
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-5">
      {/* Marketplace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#242526] p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/60">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Marketplace
          </h2>
          <p className="text-xs text-zinc-500">Discover buy & sell listings in your community</p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search Marketplace..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-100 dark:bg-[#3a3b3c] rounded-full text-xs text-zinc-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
              selectedCategory === cat
                ? "bg-[#1877f2] text-white shadow-sm"
                : "bg-white dark:bg-[#242526] border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#3a3b3c]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/60 overflow-hidden group hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white font-black text-sm rounded-lg">
                  {item.price}
                </span>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-[#e4e6eb] line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>

            <div className="p-3 pt-0">
              <button
                onClick={() => onOpenChatWithSeller(item.seller)}
                className="w-full py-2 bg-[#1877f2]/10 hover:bg-[#1877f2]/20 text-[#1877f2] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message Seller</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
