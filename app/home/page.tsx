"use client";

import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Note } from "@/types/note";
import { getAllNotes, addNote } from "@/lib/firestore";
import { db } from "@/lib/firebase";
import { Tag } from "@/types/tag";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

import Article from "@/app/components/home/grid/article";
import Calendar from "@/app/components/home/grid/calendar";
import RecentlyNotes from "@/app/components/home/grid/recentlyNotes";
import Thread from "@/app/components/home/grid/thread";
import Chart from "@/app/components/home/grid/Heatmap";
import Todolist from "@/app/components/home/grid/todolist";
import Theme from "@/app/components/home/grid/theme";
import QuickStartGuide from "@/app/components/home/grid/QuickStartGuide";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { gridlayouts } from "../components/home/config/gridLayouts";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [latestNotes, setLatestNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }

    if (user) {
      (async () => {
        const allNotes = await getAllNotes(user.uid);

        const sortedNotes = allNotes
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 3);

        setLatestNotes(sortedNotes);

        const q = query(collection(db, "tags"), where("userId", "==", user.uid));
        const unsubscribeTags = onSnapshot(q, (snapshot) => {
          const fetchedTags: Tag[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Tag[];
          setTags(fetchedTags);
        });

        return () => unsubscribeTags();
      })();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex flex-col bg-[#f3f5f7] py-6 dark:bg-[var(--background)]">
      <div className="flex items-center justify-between mb-3 px-12">
        <h1 className="text-3xl font-bold ml-4">Welcome back! 🔮</h1>
        <button
          className="bg-[var(--color-primary)] text-white rounded-[8px] px-4 py-3 cursor-pointer mr-4 hover:bg-[#323153]"
          onClick={async () => {
            if (!user) return;

            try {
              const q = query(
                collection(db, "notes"),
                where("userId", "==", user.uid),
                orderBy("order", "asc"),
                limit(1)
              );
              const snapshot = await getDocs(q);

              const minOrder = snapshot.empty
                ? 0
                : (snapshot.docs[0].data().order as number) - 1;

              await addNote({
                title: "Untitled Note",
                content: "請輸入內容...",
                userId: user.uid,
                order: minOrder,
              });

              router.push(`/home/note`);
            } catch (err) {
              console.error("新增筆記失敗", err);
            }
          }}
        >
          + New Note
        </button>
      </div>
      <main className="w-full mx-auto px-12">
        <ResponsiveGridLayout
          className="layout"
          layouts={gridlayouts}
          breakpoints={{ lg: 1400, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 9, md: 8, sm: 8, xs: 4, xxs: 2 }}
          rowHeight={50}
          useCSSTransforms={true}
          isDraggable={true}
          isResizable={false}
          draggableCancel=".cancel-drag"
        >
          <div key="article">
            <Article />
          </div>
          <div key="calendar">
            <Calendar />
          </div>
          <div key="recentlyNotes">
            <RecentlyNotes latestNotes={latestNotes} tags={tags} />
          </div>
          <div key="thread">
            <Thread />
          </div>
          <div key="chart">
            <Chart />
          </div>
          <div key="todolist">
            <Todolist userUid={user.uid} />
          </div>
          <div key="theme">
            <Theme />
          </div>
          <div key="quickStart">
            <QuickStartGuide />
          </div>
        </ResponsiveGridLayout>
      </main>
    </div>
  );
}
