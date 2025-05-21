"use client";
import { useState } from "react";
import Button from "./Button";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle"

interface SidebarProps {
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
}

const pages = ["Home", "Notes", "Calendar"];

//對應icon
const iconMap: Record<string, string> = {
  Home: "/icons/home.svg",
  Notes: "/icons/note.svg",
  Calendar: "/icons/note.svg"
};


export default function Sidebar({
  userName,
  userEmail,
  userAvatar,
}: SidebarProps) {
  const [activePage, setActivePage] = useState("Notes");
  const [activeTag, setActiveTag] = useState("");
  const tags = ["Work", "Study", "Diary"];

  return (
    <div className="w-[18%] flex flex-col">
      {/* 登入資料 */}
      <div className="flex items-center justify-center gap-[12px] p-4">
        <img
          src={userAvatar || "/default-avatar.png"}
          alt="avatar"
          className="rounded-full w-[36px] h-[36px]"
        />
        <div>
          <p className=" font-semibold">{userName}</p>
          <p className="text-xs text-[#9E9E9E]">{userEmail}</p>
        </div>
      </div>
      <ThemeToggle />
      {/* 功能頁選單 */}
      <div className="flex flex-col gap-3 px-3 py-8 border-t border-[var(--line)]">
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
      {/* 標籤選單 */}
      <div className="flex-1 p-4 border-t border-[var(--line)]">
        <p className="text-sm font-semibold mb-2">TAGS</p>
        <ul className="flex flex-col gap-3">
          {tags.map((tag) => {
            const isActive = activePage === tag;

            return (
              <Button 
                variant={isActive ? "active" : "default"}
                onClick={() => setActiveTag(tag)}
                className="flex items-center gap-[22px]">
                <img
                  src={"/icons/home.svg"}
                  alt={`${tag} icon`}
                  className="w-[22px] h-[22px] transition-all filter"
                />
              <li
                key={tag}
                className="text-sm text-gray-700 hover:underline cursor-pointer"
              >
                {tag}
              </li>
              </Button>
            );
          })}
        </ul>
        <Button className="mt-4 w-full text-xs">+ Add Tag</Button>
      </div>
    </div>
  );
}
