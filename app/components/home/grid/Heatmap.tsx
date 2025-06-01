"use client";

import React, { useEffect, useState, ReactElement } from "react";
import {
  eachDayOfInterval,
  format,
  endOfToday,
  subMonths,
  startOfMonth,
} from "date-fns";
import { getAllNotes } from "@/lib/firestore";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/note";
import Card from "../ui/card";

//根據筆記數量決定顏色
function getColorByCount(count: number): string {
  if (count === 0) return "bg-gray-300";
  if (count <= 2) return "bg-indigo-100";
  if (count <= 4) return "bg-indigo-300";
  if (count <= 6) return "bg-indigo-500";
  return "bg-indigo-700";
}

export default function Heatmap() {
  const { user } = useAuth();
  const [dailyCounts, setDailyCounts] = useState<Record<string, number>>({});
  const [totalNotes, setTotalNotes] = useState(0);
  const [streakDays, setStreakDays] = useState(0);

  const today = endOfToday();
  const startDate = startOfMonth(subMonths(today, 1)); // 三個月前的月初
  const allDates = eachDayOfInterval({ start: startDate, end: today });

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      const notes = await getAllNotes(user.uid);
      const countMap: Record<string, number> = {};

      notes.forEach((note: Note) => {
        const dateStr = format(new Date(note.updatedAt), "yyyy-MM-dd");
        countMap[dateStr] = (countMap[dateStr] || 0) + 1;
      });

      setDailyCounts(countMap);
      setTotalNotes(notes.length);

      //計算連續記錄天數
      let streak = 0;
      for (let i = allDates.length - 1; i >= 0; i--) {
        const dateStr = format(allDates[i], "yyyy-MM-dd");
        if (countMap[dateStr]) {
          streak++;
        } else {
          break;
        }
      }
      setStreakDays(streak);
    };

    fetchNotes();
  }, [user]);

  // 將所有日期切成每週
  const weeks: ReactElement[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    const week = allDates.slice(i, i + 7);
    weeks.push(
      week.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const count = dailyCounts[dateStr] || 0;
        const color = getColorByCount(count);

        return (
          <div
            key={dateStr}
            title={`${count} 筆 - ${dateStr}`}
            className={clsx("w-4 h-4 m-[1px] rounded", color)}
          />
        );
      })
    );
  }

  //月份標籤
  const monthLabels: { month: string; index: number }[] = [];
  let lastMonth = "";
  weeks.forEach((_, i) => {
    const date = allDates[i * 7];
    const monthName = format(date, "MMM");
    if (monthName !== lastMonth) {
      monthLabels.push({ month: monthName, index: i });
      lastMonth = monthName;
    }
  });

  return (
    <Card className="flex justify-around items-center px-10 py-4 gap-7">
      <div className="flex flex-col items-start justify-center gap-7 text-left h-full rounded-md">
          <p>
            已連續記錄 <span className="font-semibold text-4xl">{streakDays}</span> 天
          </p>
          <p>
            共累積 <span className="font-semibold text-4xl">{totalNotes}</span> 篇筆記
          </p>
        </div>
      <div className="flex flex-col">
      {/* 月份標籤列 */}
      <div className="flex justify-center text-xs text-gray-500">
        {weeks.map((_, idx) => {
          const label = monthLabels.find((m) => m.index === idx);
          return (
            <div key={idx} className="w-4 h-4 m-[1px] flex justify-center">
              {label ? label.month : ""}
            </div>
          );
        })}
      </div>

      {/* heatmap格子 */}
      <div className="flex items-start gap-1 overflow-x-auto">
        {/* 縱軸：星期標籤 */}
        <div className="flex flex-col justify-between h-[112px] text-xs text-gray-500 pr-2">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((label, idx) => (
            <div key={idx} className="h-4 m-[1px]">
              {label}
            </div>
          ))}
        </div>

        {/* heatmap 主體 */}
        <div className="flex gap-1">
          {weeks.map((week, idx) => (
            <div key={idx} className="flex flex-col">
              {week}
            </div>
          ))}
        </div>
      </div>

      {/* 色階 */}
      <div className="flex flex-wrap justify-between items-center w-full mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Less</span>
          {[0, 1, 3, 5, 7].map((count) => (
            <div
              key={count}
              className={clsx("w-4 h-4 rounded", getColorByCount(count))}
            />
          ))}
          <span>More</span>
        </div>
      </div>
      </div>
    </Card>
  );
}
