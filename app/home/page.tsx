"use client";

import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Note } from "@/types/note";
import { getAllNotes } from "@/lib/firestore";
import { db } from "@/lib/firebase";
import { Tag } from "@/types/tag";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { MonthlyNoteCount, groupNotesByMonth } from "@/lib/utils";

import Article from "@/app/components/home/grid/article";
import Calendar from "@/app/components/home/grid/calendar";
import RecentlyNotes from "@/app/components/home/grid/recentlyNotes";
import Thread from "@/app/components/home/grid/thread";
import Chart from "@/app/components/home/grid/chart";
import Todolist from "@/app/components/home/grid/todolist";
import Theme from "@/app/components/home/grid/theme";
import QuickStartGuide from "@/app/components/home/grid/QuickStartGuide";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const layouts = {
  lg: [
    { i: "article", x: 0, y: 0, w: 4, h: 4 },
    { i: "calendar", x: 0, y: 5, w: 2, h: 4 },
    { i: "recentlyNotes", x: 4, y: 0, w: 2, h: 8 },
    { i: "thread", x: 2, y: 4, w: 2, h: 4 },
    { i: "chart", x: 2, y: 8, w: 4, h: 4 },
    { i: "todolist", x: 7, y: 8, w: 2, h: 8 },
    { i: "theme", x: 0, y: 8, w: 2, h: 4 },
    { i: "quickStart", x: 7, y: 0, w: 2, h: 4 },
  ],
};

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [latestNotes, setLatestNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [chartData, setChartData] = useState<MonthlyNoteCount[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }

    if (user) {
      (async () => {
        const allNotes = await getAllNotes(user.uid);
        setChartData(groupNotesByMonth(allNotes));

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
    <div className="flex flex-col min-h-screen bg-[#f3f5f7] px-4 py-6 dark:bg-[var(--background)]">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-3xl font-bold pl-4">Welcome back! 🔮</h1>
        <button className="bg-[var(--color-primary)] text-white rounded-[8px] px-4 py-3 cursor-pointer">
          + New Note
        </button>
      </div>
      <main className="w-full max-w-6xl mx-auto">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
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
            <Chart data={chartData} />
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
