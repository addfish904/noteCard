"use client";

import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNoteContext } from "../context/NoteContext";
import { useTags } from "../context/TagContext";

import Article from "@/app/components/home/grid/article";
import Calendar from "@/app/components/home/grid/calendar";
import RecentlyNotes from "@/app/components/home/grid/recentlyNotes";
import Thread from "@/app/components/home/grid/thread";
import Chart from "@/app/components/home/grid/Heatmap";
import Todolist from "@/app/components/home/grid/todolist";
import Theme from "@/app/components/home/grid/theme";
import QuickStartGuide from "@/app/components/home/grid/QuickStartGuide";

import { gridlayouts } from "../components/home/config/gridLayouts";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { notes, addNote } = useNoteContext();
  const { tags } = useTags();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  // 取最新三筆筆記
  const latestNotes = notes
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="flex flex-col bg-[#f3f5f7] py-6 dark:bg-[var(--background)]">
      <div className="flex items-center justify-between mb-3 sm:px-8 px-6 sm:flex-row flex-col sm:gap-0 gap-4">
        <h1 className="text-3xl font-bold ml-4">Welcome back! 🔮</h1>
        <button
          className="bg-[var(--color-primary)] text-white rounded-[8px] px-4 py-3 cursor-pointer sm:mr-4 mr-0 hover:bg-[#201F45] w-full sm:w-fit"
          onClick={async () => {
            try {
              await addNote();
              router.push(`/home/note`);
            } catch (err) {
              console.error("新增筆記失敗", err);
            }
          }}
        >
          + New Note
        </button>
      </div>
      <main className="w-full mx-auto sm:px-8 px-4">
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
            <Article userUid={user.uid} />
          </div>
          <div key="calendar">
            <Calendar />
          </div>
          <div key="recentlyNotes">
            <RecentlyNotes latestNotes={latestNotes} tags={tags} />
          </div>
          <div key="thread">
            <Thread userUid={user.uid} />
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
