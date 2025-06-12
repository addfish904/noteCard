import { useNoteContext } from "@/app/context/NoteContext";
import { eachDayOfInterval, endOfToday, format, startOfMonth, subMonths, isSameMonth } from "date-fns";
import { useEffect, useState } from "react";
import Card from "../ui/card";
import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ReactElement } from "react";
import { Timestamp } from "firebase/firestore";

function getColorByCount(count: number): string {
  if (count === 0) return "bg-gray-300 dark:bg-[#575757]";
  if (count <= 2) return "bg-blue-100 dark:bg-[#7B8358]";
  if (count <= 4) return "bg-blue-300 dark:bg-[#A4B072]";
  if (count <= 6) return "bg-blue-500 dark:bg-[#B3C761]";
  return "bg-blue-700 dark:bg-[#D9F273]";
}

function toDate(input: Date | string | Timestamp): Date | null {
  if (!input) return null;

  if (input instanceof Timestamp) return input.toDate();
  if (typeof input === "string") return new Date(input);
  if (input instanceof Date) return input;

  return null;
}

export default function Heatmap() {
  const { notes } = useNoteContext();
  const [dailyCounts, setDailyCounts] = useState<Record<string, number>>({});
  const [streakDays, setStreakDays] = useState(0);
  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);

  const today = endOfToday();
  const startDate = startOfMonth(subMonths(today, 2)); // 顯示2個月
  const allDates = eachDayOfInterval({ start: startDate, end: today });

  useEffect(() => {
    if (!notes) return;
  
    const countMap: Record<string, number> = {};
    let thisMonthCount = 0;
    let lastMonthCount = 0;
  
    notes.forEach((note) => {
      const createdDate = toDate(note.createdAt);
      if (!createdDate) return;
  
      const dateStr = format(createdDate, "yyyy-MM-dd");
  
      countMap[dateStr] = (countMap[dateStr] || 0) + 1;
  
      if (isSameMonth(createdDate, today)) {
        thisMonthCount++;
      } else if (isSameMonth(createdDate, subMonths(today, 1))) {
        lastMonthCount++;
      }
    });
  
    setDailyCounts(countMap);
    setThisMonthTotal(thisMonthCount);
    setLastMonthTotal(lastMonthCount);
  
    // 計算連續記錄天數
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
  }, [notes]);
  

  const percentChange =
    lastMonthTotal === 0
      ? null
      : Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);

  // heatmap
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

  const monthLabels: { month: string; index: number }[] = [];
  let lastMonthLabel = "";
  weeks.forEach((_, i) => {
    const date = allDates[i * 7];
    const monthName = format(date, "MMM");
    if (monthName !== lastMonthLabel) {
      monthLabels.push({ month: monthName, index: i });
      lastMonthLabel = monthName;
    }
  });

  return (
    <Card className="flex justify-between items-center px-4 py-4 gap-7">
      <div className="flex flex-col items-start justify-center text-left h-full w-full rounded-2xl border border-gray-300 bg-gray-50 p-6 dark:bg-[#292929]">
        <h2 className="text-gray-400 mt-1">This Month</h2>
        <div className="mt-2">
          <p>
            連續記錄 <span className="font-semibold text-4xl">{streakDays}</span> 天 /
          </p>
        </div>
        <div>
          <p>
            一共累積 <span className="font-semibold text-4xl">{thisMonthTotal}</span> 篇筆記
          </p>
          {percentChange !== null && (
            <p
              className={clsx(
                "text-sm flex items-center mt-2 gap-1 px-2 py-1 w-fit rounded",
                percentChange >= 0 ? "text-green-600 bg-[#E9FAF7]" : "text-red-500"
              )}
            >
              {percentChange >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(percentChange)}%
            </p>
          )}
        </div>
      </div>

      {/* Heatmap 區域（不變） */}
      <div className="m-auto">
      <div className="flex flex-col">
        <div className="flex justify-center text-xs text-gray-500">
          {weeks.map((_, idx) => {
            const label = monthLabels.find((m) => m.index === idx);
            return (
              <div key={idx} className="w-4 h-4 m-[1px] flex justify-center text-[10px]">
                {label ? label.month : ""}
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-1 overflow-x-auto">
          <div className="flex flex-col justify-between h-full text-[10px] text-gray-500">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((label, idx) => (
              <div key={idx} className="h-4 m-[1px]">
                {label}
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {weeks.map((week, idx) => (
              <div key={idx} className="flex flex-col">
                {week}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center w-full mt-2 text-[10px] text-gray-600">
          <div className="flex items-center gap-1">
            <span>Less</span>
            {[0, 1, 3, 5, 7].map((count) => (
              <div
                key={count}
                className={clsx("w-4 h-2 rounded", getColorByCount(count))}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
      </div>
    </Card>
  );
}
