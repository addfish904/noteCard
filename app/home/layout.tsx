"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { Tag } from "@/types/tag";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Sidebar from "@/app/components/note/Sidebar";
import { TagContext } from "@/app/context/TagContext";
import { SelectedTagProvider, useSelectedTag } from "@/app/context/SelectedTagContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { logout } from "@/lib/firestore";

function MobileSidebar({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const { setSelectedTagId } = useSelectedTag();
  const [, setActiveTagId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleNavigate = (callback: () => void) => {
    callback();
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu className="w-6 h-6 text-black dark:text-white" />
      </SheetTrigger>
      <SheetContent side="right" className="px-6 py-12 w-[40%]">
        <div className="flex flex-col gap-8 p-6 border-b border-[var(--line)]">
          {[
            { href: "/home", label: "Home", icon: "Home.svg" },
            { href: "/home/note", label: "Notes", icon: "Note.svg" },
            { href: "/home/calendar", label: "Calendar", icon: "Calendar.svg" },
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
        {/* tag標籤 */}
        <div className="flex flex-col gap-8 p-6 border-b border-[var(--line)]">
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
                setSelectedTagId(tag.id);
                setActiveTagId(tag.id);
                router.push("/home/note");
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
        {/* 設定/登出 */}
        <div className="flex flex-col gap-8 p-6">
        <button className="flex items-center gap-[22px] justify-start cursor-pointer">
          <Image
            src="/icons/Settings.svg"
            alt="setting icon"
            width={18}
            height={18}
            className="dark:invert"
          />
          <span className="dark:text-white">設定</span>
        </button>
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
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }

    if (user) {
      const q = query(collection(db, "tags"), where("userId", "==", user.uid));
      const unsubscribeTags = onSnapshot(q, (snapshot) => {
        const fetchedTags: Tag[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tag[];
        setTags(fetchedTags);
      });

      return () => unsubscribeTags();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <TagContext.Provider value={{ tags }}>
      <SelectedTagProvider>
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--line)]">
            <header className="h-[54px] shrink-0 text-xl font-semibold flex items-center px-6 pt-1">
              Notecard
            </header>
            {/* 手機版漢堡選單 */}
            <div className="px-6 flex md:hidden">
              <MobileSidebar tags={tags} />
            </div>
          </div>
          <div className="flex flex-1">
            <aside className="hidden md:block">
              <Sidebar
                userName={user.displayName}
                userEmail={user.email}
                userAvatar={user.photoURL}
                userId={user.uid}
                tags={tags}
              />
            </aside>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </SelectedTagProvider>
    </TagContext.Provider>
  );
}
