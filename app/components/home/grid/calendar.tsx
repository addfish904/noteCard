"use client";

import clsx from "clsx";
import Card from "../ui/card";
import { useRouter } from "next/navigation";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getCalendarDays(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = (firstDayOfMonth.getDay() + 6) % 7; // 讓週一是第一天

  const days = [];

  // 前面補空白
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // 當月日期
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
}

export default function CustomCalendar() {
  const router = useRouter();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = getCalendarDays(year, month);

  const todayDate = today.getDate();
  const isThisMonth =
    month === today.getMonth() && year === today.getFullYear();

  return (
    <Card className="p-4 flex flex-col justify-center">
      {/* 星期列 */}
      <div className="grid grid-cols-7 text-xs text-center text-gray-500 font-medium uppercase mb-2 dark:text-gray-300">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 日期格 */}
      <div className="grid grid-cols-7 gap-1 text-sm text-center">
        {days.map((day, idx) => (
          <div
            key={idx}
            onClick={() => {router.push("/home/calendar")}}
            className={clsx(
              "cancel-drag aspect-square rounded-md flex items-center justify-center",
              day
                ? "text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-200"
                : ""
            )}
          >
            {day && (
              <span
                className={clsx(
                  "inline-block w-7 h-7 leading-7 rounded-full",
                  isThisMonth && day === todayDate
                    ? "bg-[#D9F273] text-black"
                    : ""
                )}
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
