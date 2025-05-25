"use client";

import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Note } from "@/types/note";
import { getAllNotes } from "@/lib/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Tag } from "@/types/tag";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import Article from "@/app/components/home/grid/article";
import Calendar from "@/app/components/home/grid/calendar";
import RecentlyNotes from "@/app/components/home/grid/recentlyNotes";
import Thread from "@/app/components/home/grid/thread";

const ResponsiveGridLayout = WidthProvider(Responsive);
interface GridItem {
  i: string;
}

export const gridItems: GridItem[] = [
  { i: "article" },
  { i: "calendar" },
  { i: "recentlyNotes" },
  { i: "thread" },
];

export const layouts = {
  lg: [
    { i: "article", x: 0, y: 0, w: 4, h: 4 },
    { i: "calendar", x: 0, y: 5, w: 2, h: 4 },
    { i: "recentlyNotes", x: 4, y: 0, w: 3, h: 8 },
    { i: "thread", x: 2, y: 4, w: 2, h: 4 },
  ],
};

export default function HomePage() {
  const [latestNotes, setLatestNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const allNotes = await getAllNotes();
        const userNotes = allNotes.filter((n) => n.userId === user.uid);

        const sortedNotes = userNotes
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 3);

        setLatestNotes(sortedNotes);

        const q = query(
          collection(db, "tags"),
          where("userId", "==", user.uid)
        );
        const unsubscribeTags = onSnapshot(q, (snapshot) => {
          const fetchedTags: Tag[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Tag[];
          setTags(fetchedTags);
        });

        return () => unsubscribeTags();
      } else {
        setLatestNotes([]);
        setTags([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F7] px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-3 pl-4">Welcome back!</h1>
        <button className="bg-[var(--color-primary)] text-white rounded-[8px] px-4 py-3 cursor-pointer">+ New Note</button>
      </div>
      <main className="w-full max-w-6xl mx-auto">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1400, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 8, md: 8, sm: 8, xs: 4, xxs: 2 }}
          rowHeight={50}
          useCSSTransforms={true}
          isDraggable={true}
          isResizable={false}
          draggableCancel='.cancel-drag'
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
        </ResponsiveGridLayout>
      </main>
    </div>
  );
}
