"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { TagProvider, useTags } from "@/app/context/TagContext";
import { NoteProvider } from "@/app/context/NoteContext";
import {
  SelectedTagProvider,
  useSelectedTag,
} from "@/app/context/SelectedTagContext";
import Sidebar from "@/app/components/note/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { logout } from "@/lib/firestore";
import type { User } from "firebase/auth";

function MobileSidebar() {
  const router = useRouter();
  const { tags } = useTags();
  const { setSelectedTagId } = useSelectedTag();
  const [, setActiveTagId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (callback: () => void) => {
    setIsLoading(true);
    callback();
    setTimeout(() => setIsLoading(false), 800); // fake loading timeout
    setOpen(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    router.push("/");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu className="w-6 h-6 text-black dark:text-white" />
      </SheetTrigger>
      <SheetContent side="right" className="px-6 py-12 w-[40%]">
        {isLoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 dark:bg-black/60">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]" />
          </div>
        )}

        <div className="flex flex-col gap-8 p-0 sm:p-6">
          {[
            { href: "/home", label: "Home", icon: "Home.svg" },
            { href: "/home/note", label: "Notes", icon: "Note.svg" },
            { href: "/home/calendar", label: "Calendar", icon: "Calendar.svg" },
            { href: "/home/canvas", label: "Canvas", icon: "draw.svg" },
          ].map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigate(() => router.push(item.href))}
              className="flex items-center gap-[22px] group justify-start cursor-pointer"
            >
              <Image
                src={`/icons/${item.icon}`}
                alt={`${item.label} icon`}
                width={20}
                height={20}
                className="transition-all filter dark:invert"
              />
              {item.label}
            </button>
          ))}
        </div>
        <hr className="my-2 text-gray-200" />

        {/* tag標籤 */}
        <div className="flex flex-col gap-8 p-0 sm:p-6">
          <button
            onClick={() =>
              handleNavigate(() => {
                setSelectedTagId(null);
                setActiveTagId(null);
                router.push("/home/note");
              })
            }
            className="flex items-center gap-[22px] justify-start cursor-pointer"
          >
            <Image
              src="/icons/tag.svg"
              alt="All tags"
              width={20}
              height={20}
              className="dark:invert"
            />
            <span className="dark:text-white">All</span>
          </button>

          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => {
                handleNavigate(() => {
                  setSelectedTagId(tag.id);
                  setActiveTagId(tag.id);
                  router.push("/home/note");
                });
              }}
              className="flex items-center gap-[22px] justify-start cursor-pointer"
            >
              <Image
                src="/icons/tag.svg"
                alt={`${tag.name} icon`}
                width={20}
                height={20}
                className="dark:invert"
              />
              <span className="dark:text-white">{tag.name}</span>
            </button>
          ))}
        </div>
        <hr className="my-2 text-gray-200" />

        {/* 設定/登出 */}
        <div className="flex flex-col gap-8 p-0 sm:p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-[22px] justify-start cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px] dark:text-white" />
            <span className="dark:text-white">登出</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function NotesLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <TagProvider userId={user.uid}>
      <SelectedTagProvider>
        <NoteProvider>
          <LayoutContent user={user}>{children}</LayoutContent>
        </NoteProvider>
      </SelectedTagProvider>
    </TagProvider>
  );
}

function LayoutContent({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const { tags } = useTags();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-[var(--line)]">
        <header className="h-[50px] shrink-0 text-xl font-semibold flex gap-3 items-center px-6 pt-1">
          <Image src="/logo.svg" alt="logo" width={26} height={26} />
          <p>Notecard</p>
        </header>
        {/* 手機版漢堡選單 */}
        <div className="px-6 flex md:hidden">
          <MobileSidebar />
        </div>
      </div>
      <div className="flex flex-1">
        <aside className="hidden md:block bg-white dark:bg-black border-r border-[var(--line)] h-screen">
          <Sidebar
            userName={user.displayName}
            userEmail={user.email}
            userAvatar={user.photoURL}
            userId={user.uid}
            tags={tags}
          />
        </aside>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
