"use client";

import { useEffect, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useTheme } from "next-themes";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

export default function ExcalidrawWrapper() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!user || loading) return;

    const fetchDrawing = async () => {
      const docRef = doc(db, "excalidraw", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        try {
          const appState = {
            viewBackgroundColor: isDark ? "#292929" : "#f3f5f7",
            collaborators: {}, // ✅ 一定要加
            ...JSON.parse(data.appState || "{}"),
          };

          setInitialData({
            elements: JSON.parse(data.elements || "[]"),
            appState: {
              viewBackgroundColor: isDark ? "#292929" : "#f3f5f7",
              ...JSON.parse(data.appState || "{}"),
            },
            files: JSON.parse(data.files || "{}"),
          });
        } catch (err) {
          console.error("解析 Firestore 資料失敗", err);
          setInitialData(null);
        }
      } else {
        // 初始空畫布
        setInitialData({
          elements: [],
          appState: {
            viewBackgroundColor: isDark ? "#292929" : "#f3f5f7",
            collaborators: {},
          },
          files: {},
        });
      }
    };

    fetchDrawing();
  }, [user, loading, isDark]);

  const handleChange = (
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    if (!user) return;

    const docRef = doc(db, "excalidraw", user.uid);

    // ⛔️ 移除 collaborators 再存
    const { collaborators, ...cleanAppState } = appState;

    queueMicrotask(() => {
      setDoc(docRef, {
        userId: user.uid,
        elements: JSON.stringify([...elements]),
        appState: JSON.stringify({
          ...cleanAppState,
          viewBackgroundColor: isDark ? "#292929" : "#f3f5f7",
        }),
        files: JSON.stringify(files),
        updatedAt: serverTimestamp(),
      });
    });
  };

  return (
    <div className="w-full h-screen">
      {initialData && (
        <Excalidraw
          theme={isDark ? "dark" : "light"}
          initialData={initialData}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
