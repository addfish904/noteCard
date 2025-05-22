"use client";

import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { Tag } from "@/types/tag";
import { addTag } from "@/lib/firestore";

interface SidebarProps {
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  userId: string | null;
  tags: Tag[]; // 👈 從 page 傳入
}

const pages = ["Home", "Notes", "Calendar"];

const iconMap: Record<string, string> = {
  Home: "/icons/home.svg",
  Notes: "/icons/note.svg",
  Calendar: "/icons/note.svg",
};

export default function Sidebar({
  userName,
  userEmail,
  userAvatar,
  userId,
  tags,
}: SidebarProps) {
  const [activePage, setActivePage] = useState("Notes");
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const newTagInputRef = useRef<HTMLInputElement | null>(null);

  const handleNewTagKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter" || !newTagName?.trim() || !userId) return;

    try {
      await addTag(newTagName.trim(), userId);
      setNewTagName(null);
    } catch (err) {
      console.error("新增標籤失敗", err);
      alert("新增標籤失敗");
    }
  };

  useEffect(() => {
    if (newTagName === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        newTagInputRef.current &&
        !newTagInputRef.current.contains(e.target as Node)
      ) {
        setNewTagName(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newTagName]);

  return (
    <div className="w-[16%] flex flex-col">
      {/* 使用者資料 */}
      <div className="flex items-center justify-center gap-[12px] p-4">
        <img
          src={userAvatar || "/default-avatar.png"}
          alt="avatar"
          className="rounded-full w-[36px] h-[36px]"
        />
        <div>
          <p className="text-s font-semibold">{userName}</p>
          <p className="text-xs text-[#9E9E9E]">{userEmail}</p>
        </div>
      </div>

      {/* 功能選單 */}
      <div className="flex flex-col gap-2 px-2 py-5 border-t border-[var(--line)]">
        {pages.map((page) => {
          const iconSrc = iconMap[page];
          const isActive = activePage === page;
          return (
            <Button
              key={page}
              variant={isActive ? "active" : "default"}
              onClick={() => setActivePage(page)}
              className="flex items-center gap-[22px] group"
            >
              <img
                src={iconSrc}
                alt={`${page} icon`}
                className={cn(
                  "w-[22px] h-[22px] transition-all filter",
                  isActive ? "invert-0" : "invert-[0.4] group-hover:invert-0"
                )}
              />
              {page}
            </Button>
          );
        })}
      </div>

      {/* 標籤欄 */}
      <div className="flex-1 py-5 px-3 border-t border-[var(--line)]">
        <p className="text-sm font-semibold mb-4 pl-2">TAGS</p>
        <div className="flex flex-col gap-2">
          {tags.map((tag) => {
            const isActive = activeTagId === tag.id;
            return (
              <Button
                key={tag.id}
                variant={isActive ? "active" : "default"}
                onClick={() => setActiveTagId(tag.id)}
                className="flex items-center gap-[22px]"
              >
                <img
                  src="/icons/tag.svg"
                  alt={`${tag.name} icon`}
                  className="w-[22px] h-[22px] transition-all filter"
                />
                <span className="text-sm text-gray-700 hover:underline cursor-pointer">
                  {tag.name}
                </span>
              </Button>
            );
          })}
          {newTagName !== null && (
            <div className="flex items-center gap-[10px] pl-5 pr-4 py-2">
              <img
                src="/icons/tag.svg"
                alt="new tag"
                className="w-[22px] h-[22px] opacity-50"
              />
              <input
                ref={newTagInputRef}
                autoFocus
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={handleNewTagKeyDown}
                placeholder="Tag Name"
                className="w-full text-sm py-1 border-b border-gray-300 bg-transparent text-center"
              />
            </div>
          )}
        </div>

        {/* 加入新標籤 */}
        {newTagName === null && (
          <button
            onClick={() => setNewTagName("")}
            className="mt-4 w-full text-gray-700 text-xs"
          >
            + 新增標籤
          </button>
        )}
      </div>
    </div>
  );
}
