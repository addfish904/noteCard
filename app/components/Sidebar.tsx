"use client";

import { useState, useEffect, useRef } from "react";
import Button from "./ui/notes/Button";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { Tag } from "@/types/tag";
import { addTag, logout as userLogout } from "@/lib/firestore";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from 'lucide-react';

interface SidebarProps {
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  userId: string | null;
  tags: Tag[];
}

const pages = ["Home", "Notes", "Calendar"];

const iconMap: Record<string, string> = {
  Home: "/icons/home.svg",
  Notes: "/icons/note.svg",
  Calendar: "/icons/note.svg",
};
const pagePathMap: Record<string, string> = {
  Home: "/note/home",
  Notes: "/note",
  Calendar: "/note/calendar",
};

export default function Sidebar({
  userName,
  userEmail,
  userAvatar,
  userId,
  tags,
}: SidebarProps) {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const newTagInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedColor, setSelectedColor] = useState("#60A5FA");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNewTagKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter" || !newTagName?.trim() || !userId) return;

    try {
      await addTag(newTagName.trim(), selectedColor, userId);
      setNewTagName(null);
      setSelectedColor("#60A5FA");
      setShowColorPicker(false);
    } catch (err) {
      console.error("新增標籤失敗", err);
      alert("新增標籤失敗");
    }
  };

  const handleLogout = async () => {
    await userLogout();
    router.push("/");
  };

  useEffect(() => {
    if (newTagName === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        newTagInputRef.current &&
        !newTagInputRef.current.contains(e.target as Node)
      ) {
        setNewTagName(null);
        setSelectedColor("#60A5FA");
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newTagName]);

  return (
    <div className="w-[18%] flex flex-col">
      {/* 使用者資料 */}
      <div className="flex items-center justify-start gap-[16px] px-5 py-4">
        <img
          src={userAvatar || "/default-avatar.png"}
          alt="avatar"
          className="rounded-full w-[36px] h-[36px]"
        />
        <div>
          <p className="text-[14px] font-semibold">{userName}</p>
          <p className="text-xs text-[#9E9E9E]">{userEmail}</p>
        </div>
      </div>

      {/* 功能選單 */}
      <div className="flex flex-col gap-2 px-2 py-5 border-t border-[var(--line)]">
        {pages.map((page) => {
        const iconSrc = iconMap[page];
        const targetPath = pagePathMap[page];
        const isActive = pathname === targetPath;

        return (
          <Button
            key={page}
            variant={isActive ? "active" : "default"}
            onClick={() => router.push(targetPath)}
            className="flex items-center gap-[22px] group"
          >
            <img
              src={iconSrc}
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
              <button
                key={tag.id}
                onClick={() => setActiveTagId(tag.id)}
                className="inline-flex items-center justify-start gap-[20px] rounded-md pl-5 pr-4 py-2 text-sm transition-colors group hover:text-black dark:text-white"
              >
                <img
                  src="/icons/tag.svg"
                  alt={`${tag.name} icon`}
                  className="w-[22px] h-[22px] transition-all filter"
                />
                <span className="text-sm text-gray-600 hover:underline cursor-pointer dark:text-white">
                  {tag.name}
                </span>
              </button>
            );
          })}
          {newTagName !== null && (
            <div
              ref={newTagInputRef}
              className="relative flex items-center gap-[10px] pl-5 pr-4 py-2"
            >
              <img
                src="/icons/tag.svg"
                alt="new tag"
                className="w-[22px] h-[22px] opacity-50"
              />
              <input
                autoFocus
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={handleNewTagKeyDown}
                placeholder="Tag Name"
                className="text-sm py-1 border-b border-gray-300 bg-transparent text-center"
              />
              <button
                className="rounded-full w-[10px] h-[10px] cursor-pointer"
                style={{ backgroundColor: selectedColor }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker((prev) => !prev);
                }}
              ></button>

              {/* 顏色選擇器 */}
              {showColorPicker && (
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute right-0 top-[40px] z-10 w-[120px] h-[36px] p-0 border-none bg-transparent cursor-pointer"
                />
              )}
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

      {/* 設定/登出 */}
      <div className="flex flex-col gap-2 py-5 px-3 border-t border-[var(--line)]">
        <button
          key="setting"
          className="inline-flex items-center justify-start gap-[20px] rounded-md pl-5 pr-4 py-2 text-sm transition-colors group hover:text-black dark:text-white"
        >
          <img
            src="/icons/Settings.svg"
            className="w-[22px] h-[22px] transition-all filter"
          />
          <span className="text-sm text-gray-600 hover:underline cursor-pointer dark:text-white">
            設定
          </span>
        </button>
        <button
          key="logout"
          onClick={handleLogout}
          className="inline-flex items-center justify-start gap-[20px] rounded-md pl-5 pr-4 py-2 text-sm transition-colors group hover:text-black dark:text-white"
        >
          <LogOut className="w-[20px] h-[20px] text-[#767676]"/>
          <span className="text-sm text-gray-600 hover:underline cursor-pointer dark:text-white">
            登出
          </span>
        </button>
      </div>
      <ThemeToggle />
    </div>
  );
}
