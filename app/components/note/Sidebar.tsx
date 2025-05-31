"use client";

import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { cn } from "@/lib/utils";
import { Tag } from "@/types/tag";
import { addTag, logout as userLogout } from "@/lib/firestore";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelectedTag } from "@/app/context/SelectedTagContext";
import Image from "next/image";

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
  const [collapsed, setCollapsed] = useState(false);
  const [, setActiveTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const newTagInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedColor, setSelectedColor] = useState("#60A5FA");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setSelectedTagId } = useSelectedTag();

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [newTagName]);

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-black transition-all duration-300 ease-in-out border-r border-[var(--line)]",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* 收合按鈕 */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-black"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* 使用者資料 */}
      {!collapsed && (
        <div className="flex items-center justify-start gap-[16px] px-5 py-2">
          <Image
            src={userAvatar || "/default-avatar.png"}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <p className="text-[14px] font-semibold">{userName}</p>
            <p className="text-xs text-[#9E9E9E]">{userEmail}</p>
          </div>
        </div>
      )}

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
              className="flex items-center gap-[22px] group justify-start"
            >
              <Image
                src={iconSrc}
                alt="page icon"
                width={22}
                height={22}
                className={cn(
                  "transition-all filter",
                  isActive ? "invert-0" : "invert-[0.4] group-hover:invert-0"
                )}
              />
              {!collapsed && page}
            </Button>
          );
        })}
      </div>

      {/* 標籤欄 */}
      <div className="py-5 px-3 border-t border-[var(--line)]">
        {!collapsed && (
          <p className="text-sm font-semibold mt-1 mb-3 pl-3">TAGS</p>
        )}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setSelectedTagId(null);
              setActiveTagId(null);
              router.push("/note");
            }}
            className="inline-flex items-center justify-start gap-[20px] rounded-md pl-5 pr-4 py-2 text-sm transition-colors dark:text-white"
          >
            <Image src="/icons/tag.svg" alt="All tags" width={22} height={22} />
            {!collapsed && (
              <span className="text-sm text-gray-600 dark:text-white">All</span>
            )}
          </button>

          {tags.map((tag) => {
            return (
              <button
                key={tag.id}
                onClick={() => {
                  setSelectedTagId(tag.id);
                  setActiveTagId(tag.id);
                  router.push("/note");
                }}
                className="inline-flex items-center justify-start gap-[20px] rounded-md pl-5 pr-4 py-2 text-sm transition-colors dark:text-white"
              >
                <Image
                  src="/icons/tag.svg"
                  alt={`${tag.name} icon`}
                  width={22}
                  height={22}
                />
                {!collapsed && (
                  <span className="text-sm text-gray-600 dark:text-white">
                    {tag.name}
                  </span>
                )}
              </button>
            );
          })}

          {/* 新增標籤輸入欄 */}
          {newTagName !== null && !collapsed && (
            <div
              ref={newTagInputRef}
              className="relative flex items-center gap-[10px] pl-5 pr-4 py-2"
            >
              <Image
                src="/icons/tag.svg"
                alt="new tag"
                width={22}
                height={22}
                className="opacity-50"
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

        {!collapsed && newTagName === null && (
          <button
            onClick={() => setNewTagName("")}
            className="mt-4 w-full text-gray-700 text-xs"
          >
            + 新增標籤
          </button>
        )}
      </div>

      {/* 設定 / 登出 */}
      <div className="flex flex-col gap-2 py-5 px-3 border-t border-[var(--line)]">
        <button className="inline-flex items-center justify-start gap-[20px] pl-5 pr-4 py-2 text-sm transition-colors group hover:text-black dark:text-white">
          <Image
            src="/icons/Settings.svg"
            alt="setting icon"
            width={22}
            height={22}
          />
          {!collapsed && (
            <span className="text-sm text-gray-600 dark:text-white">設定</span>
          )}
        </button>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-start gap-[20px] pl-5 pr-4 py-2 text-sm transition-colors group hover:text-black dark:text-white"
        >
          <LogOut className="w-[20px] h-[20px] text-[#767676]" />
          {!collapsed && (
            <span className="text-sm text-gray-600 dark:text-white">登出</span>
          )}
        </button>
      </div>
    </div>
  );
}
