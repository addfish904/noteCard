"use client";

import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { cn } from "@/lib/utils";
import { Tag } from "@/types/tag";
import { addTag, logout as userLogout, deleteTag } from "@/lib/firestore";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Trash2,
} from "lucide-react";
import { useSelectedTag } from "@/app/context/SelectedTagContext";
import Image from "next/image";

interface SidebarProps {
  userName: string | null;
  userAvatar: string | null;
  userId: string | null;
  tags: Tag[];
}

const pages = ["Home", "Notes", "Calendar", "Canvas"];

const iconMap: Record<string, string> = {
  Home: "/icons/Home.svg",
  Notes: "/icons/Note.svg",
  Calendar: "/icons/Calendar.svg",
  Canvas: "/icons/draw.svg",
};

const pagePathMap: Record<string, string> = {
  Home: "/home",
  Notes: "/home/note",
  Calendar: "/home/calendar",
  Canvas: "/home/canvas",
};

export default function Sidebar({
  userName,
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
  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const editMenuRef = useRef<HTMLDivElement | null>(null); // 追蹤選單元素

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

  // 點擊外部關閉新增標籤輸入框
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

  // 點擊外部自動關閉編輯選單
  useEffect(() => {
    if (!editingTagId) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(e.target as Node)
      ) {
        setEditingTagId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingTagId]);

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* 使用者資料 */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {/* 使用者資訊 */}
        {!collapsed && (
          <div className="flex items-center justify-start gap-[16px] px-6 py-3">
            <Image
              src={userAvatar || "/default-avatar.png"}
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div>
              <p className="text-[14px] font-semibold">{userName}</p>
            </div>
          </div>
        )}
        {/* 收合按鈕 */}
        <div className="flex px-2 py-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-black"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* 功能選單 */}
      <div
        className={cn(
          "flex flex-col px-3 py-5 border-t border-[var(--line)]",
          collapsed ? "gap-4" : "gap-2"
        )}
      >
        {pages.map((page) => {
          const iconSrc = iconMap[page];
          const targetPath = pagePathMap[page];
          const isActive = pathname === targetPath;

          return (
            <Button
              key={page}
              variant={isActive ? "active" : "default"}
              onClick={() => router.push(targetPath)}
              className={cn(
                "flex items-center gap-[22px] group justify-start",
                collapsed ? "py-2 px-0 justify-center" : ""
              )}
            >
              <Image
                src={iconSrc}
                alt="page icon"
                width={20}
                height={20}
                className={cn(
                  "transition-all filter",
                  isActive ? "invert-0" : "invert-[0.4] group-hover:invert-0",
                  "dark:invert"
                )}
              />
              {!collapsed && page}
            </Button>
          );
        })}
      </div>

      {/* 標籤欄 */}
      <div
        className={cn(
          "py-5 px-3 border-t border-[var(--line)]",
          collapsed ? "hidden" : ""
        )}
      >
        {!collapsed && (
          <p className="text-sm font-semibold mt-1 mb-3 pl-3">TAGS</p>
        )}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setSelectedTagId(null);
              setActiveTagId(null);
              router.push("/home/note");
            }}
            className="inline-flex items-center justify-start cursor-pointer gap-[20px] rounded-md text-sm transition-colors dark:text-white pl-5 pr-4 py-2 dark:hover:bg-[var(--color-secondary)]"
          >
            <Image
              src="/icons/tag.svg"
              alt="All tags"
              width={20}
              height={20}
              className="invert-[0.4] dark:invert"
            />
            {!collapsed && (
              <span className="text-sm text-gray-600 dark:text-white">All</span>
            )}
          </button>

          {tags.map((tag) => {
            const isHovered = hoveredTagId === tag.id;
            const isEditing = editingTagId === tag.id;

            return (
              <div
                key={tag.id}
                className="relative"
                onMouseEnter={() => setHoveredTagId(tag.id)}
                onMouseLeave={() => setHoveredTagId(null)}
              >
                <button
                  onClick={() => {
                    setSelectedTagId(tag.id);
                    setActiveTagId(tag.id);
                    router.push("/home/note");
                  }}
                  className="inline-flex items-center justify-start w-full gap-[20px] rounded-md text-sm transition-colors dark:text-white pl-5 pr-4 py-2 dark:hover:bg-[var(--color-secondary)] cursor-pointer"
                >
                  <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <span
                      className="rounded-full w-[10px] h-[10px]"
                      style={{ backgroundColor: tag.color }}
                    />
                  </div>
                  {!collapsed && (
                    <span className="text-sm text-gray-600 dark:text-white">
                      {tag.name}
                    </span>
                  )}
                </button>

                {!collapsed && isHovered && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTagId(tag.id);
                    }}
                    className="absolute right-2 top-2 text-xs text-gray-400 hover:text-black dark:text-white cursor-pointer w-6 h-6 bg-[var(--color-secondary)] rounded flex items-center justify-center"
                  >
                    <Ellipsis className="w-4 h-4 text-[#C8C8C8]" />
                  </button>
                )}

                {isEditing && (
                  <div
                    ref={editMenuRef}
                    className="absolute right-2 top-8 z-10 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded shadow "
                  >
                    <button
                      onClick={async () => {
                        try {
                          await deleteTag(tag.id);
                          setEditingTagId(null);
                        } catch (err) {
                          console.error("刪除標籤失敗", err);
                          alert("刪除失敗");
                        }
                      }}
                      className="px-4 py-2 text-sm w-full text-left p-1 cursor-pointer bg-white hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Trash2 className="text-gray-600 w-[16px]" />
                        <p>刪除標籤</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {newTagName !== null && !collapsed && (
            <div
              ref={newTagInputRef}
              className="relative flex items-center gap-[10px] pl-5 pr-4 py-2"
            >
              <div className="w-[20px] h-[20px] flex items-center justify-center">
                <button
                  className="rounded-full w-[10px] h-[10px] cursor-pointer"
                  style={{ backgroundColor: selectedColor }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowColorPicker((prev) => !prev);
                  }}
                ></button>
              </div>
              <input
                autoFocus
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={handleNewTagKeyDown}
                placeholder="Tag Name"
                className="text-sm py-1 border-b border-gray-300 bg-transparent text-center"
              />

              {showColorPicker && (
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute left-0 top-[40px] z-10 w-[120px] h-[36px] p-0 border-none bg-transparent cursor-pointer"
                />
              )}
            </div>
          )}
        </div>

        {!collapsed && newTagName === null && (
          <button
            onClick={() => setNewTagName("")}
            className="mt-6 w-full text-gray-700 text-xs dark:text-white cursor-pointer"
          >
            + 新增標籤
          </button>
        )}
      </div>

      {/* 設定 / 登出 */}
      <div
        className={cn(
          "flex flex-col gap-2 py-5 px-3 border-t border-[var(--line)]",
          collapsed ? "hidden" : ""
        )}
      >
        {/* <button className="inline-flex items-center justify-start gap-[20px] pl-5 pr-4 py-2 text-sm transition-colors group hover:text-black dark:text-white rounded-md dark:hover:bg-[var(--color-secondary)]">
          <Image
            src="/icons/Settings.svg"
            alt="setting icon"
            width={18}
            height={18}
            className="invert-[0.4] dark:invert"
          />
          {!collapsed && (
            <span className="text-sm text-gray-600 dark:text-white">設定</span>
          )}
        </button> */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-start gap-[20px] pl-5 pr-4 py-2 text-sm transition-colors group hover:text-black dark:text-white rounded-md dark:hover:bg-[var(--color-secondary)] cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px] text-[#767676] dark:text-white" />
          {!collapsed && (
            <span className="text-sm text-gray-600 dark:text-white">登出</span>
          )}
        </button>
      </div>
    </div>
  );
}
