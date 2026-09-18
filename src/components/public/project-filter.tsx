"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Check, Code2, Layers } from "lucide-react";
import { CategoryData } from "@/types";

export interface TechStackOption {
  name: string;
  count: number;
}

interface ProjectFilterProps {
  categories: CategoryData[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  availableTechStacks: TechStackOption[];
  selectedTechStack: string;
  onSelectTechStack: (techStack: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

export function ProjectFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  availableTechStacks,
  selectedTechStack,
  onSelectTechStack,
  searchQuery,
  onSearchChange,
  totalCount,
}: ProjectFilterProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (techStackRef.current && !techStackRef.current.contains(event.target as Node)) {
        setIsTechStackOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCategoryOpen(false);
        setIsTechStackOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeCategory = categories.find((c) => c.slug === selectedCategory);
  const activeCategoryLabel =
    selectedCategory === "all"
      ? "All Works"
      : activeCategory?.name || selectedCategory;

  const activeCategoryCount =
    selectedCategory === "all"
      ? totalCount
      : activeCategory?._count?.projects ?? 0;

  const activeStackLabel =
    selectedTechStack === "all"
      ? "All Tech Stacks"
      : selectedTechStack;

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex items-center w-full sm:w-80">
          <Search className="absolute left-3.5 size-4 text-zinc-400 dark:text-zinc-500 pointer-events-none shrink-0" />
          <input
            type="text"
            placeholder="Search projects, technologies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-16 text-xs sm:text-sm rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 shadow-xs transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-3.5 shrink-0" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 pointer-events-none">
              /
            </kbd>
          )}
        </div>

        {/* Filter Dropdowns on the exact same horizontal level */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Category Dropdown (All Works) */}
          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => {
                setIsTechStackOpen(false);
                setIsCategoryOpen((prev) => !prev);
              }}
              aria-haspopup="listbox"
              aria-expanded={isCategoryOpen}
              className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs font-semibold rounded-xl transition-all shadow-xs border cursor-pointer whitespace-nowrap ${
                selectedCategory !== "all"
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-500/20"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/90 dark:border-zinc-800/90 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              <Layers className="size-3.5 shrink-0 text-blue-500" />
              <span className="truncate max-w-[130px] sm:max-w-none">
                {activeCategoryLabel}
              </span>
              <span className="font-mono text-[10.5px] opacity-75 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                {activeCategoryCount}
              </span>
              <ChevronDown
                className={`size-3.5 shrink-0 text-zinc-400 transition-transform duration-200 ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Category Popover Menu */}
            {isCategoryOpen && (
              <div
                role="listbox"
                className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2.5 py-1.5 text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  <span>Filter by Category</span>
                  {selectedCategory !== "all" && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory("all");
                        setIsCategoryOpen(false);
                      }}
                      className="text-blue-500 hover:underline capitalize cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* "All Works" option */}
                <button
                  type="button"
                  role="option"
                  aria-selected={selectedCategory === "all"}
                  onClick={() => {
                    onSelectCategory("all");
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="size-3.5 shrink-0 text-blue-500 opacity-80" />
                    <span>All Works</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      {totalCount}
                    </span>
                    {selectedCategory === "all" && (
                      <Check className="size-3.5 text-blue-500" />
                    )}
                  </div>
                </button>

                {/* Sub-categories */}
                {categories.map((cat) => {
                  const count = cat._count?.projects ?? 0;
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-blue-500/70" />
                        <span>{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          {count}
                        </span>
                        {isSelected && (
                          <Check className="size-3.5 text-blue-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tech Stack Dropdown (All Tech Stacks) */}
          <div className="relative" ref={techStackRef}>
            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen(false);
                setIsTechStackOpen((prev) => !prev);
              }}
              aria-haspopup="listbox"
              aria-expanded={isTechStackOpen}
              className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs font-semibold rounded-xl transition-all shadow-xs border cursor-pointer whitespace-nowrap ${
                selectedTechStack !== "all"
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-500/20"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/90 dark:border-zinc-800/90 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              <Code2 className="size-3.5 shrink-0 text-blue-500" />
              <span className="truncate max-w-[130px] sm:max-w-none">{activeStackLabel}</span>
              <ChevronDown
                className={`size-3.5 shrink-0 text-zinc-400 transition-transform duration-200 ${
                  isTechStackOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Tech Stack Popover Menu */}
            {isTechStackOpen && (
              <div
                role="listbox"
                className="absolute right-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2.5 py-1.5 text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  <span>Filter by Tech Stack</span>
                  {selectedTechStack !== "all" && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTechStack("all");
                        setIsTechStackOpen(false);
                      }}
                      className="text-blue-500 hover:underline capitalize cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* "All Tech Stacks" option */}
                <button
                  type="button"
                  role="option"
                  aria-selected={selectedTechStack === "all"}
                  onClick={() => {
                    onSelectTechStack("all");
                    setIsTechStackOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                    selectedTechStack === "all"
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="size-3.5 shrink-0 opacity-70 text-blue-500" />
                    <span>All Tech Stacks</span>
                  </div>
                  {selectedTechStack === "all" && (
                    <Check className="size-3.5 text-blue-500" />
                  )}
                </button>

                {/* Dynamic Tech Stack Options */}
                {availableTechStacks.map((stack) => {
                  const isSelected = selectedTechStack.toLowerCase() === stack.name.toLowerCase();
                  return (
                    <button
                      key={stack.name}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectTechStack(stack.name);
                        setIsTechStackOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="size-3.5 shrink-0 opacity-70 text-blue-500" />
                        <span>{stack.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          {stack.count}
                        </span>
                        {isSelected && (
                          <Check className="size-3.5 text-blue-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
