"use client";

import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [hoverBox, setHoverBox] = useState({ top: 0, left: 0, visible: false });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const slots = document.querySelectorAll(".fc-timegrid-slot");
      slots.forEach((slot) => {
        const rect = slot.getBoundingClientRect();
        const isInside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isInside) {
          setHoverBox({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX + rect.width - 24,
            visible: true,
          });
        }
      });
    };

    const handleMouseLeave = () => {
      setHoverBox({ ...hoverBox, visible: false });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.querySelector(".fc-timegrid")?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.querySelector(".fc-timegrid")?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleAddTask = () => {
    alert("新增任務彈窗");
  };

  return (
    <div className="relative p-4 bg-white rounded-2xl shadow-md">
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={false}
        selectable={true}
        editable={true}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        slotDuration="00:30:00"
        height="auto"
        nowIndicator={true}
        events={[]}
      />

      {hoverBox.visible && (
        <button
          onClick={handleAddTask}
          className="absolute z-50 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-gray-700"
          style={{ top: hoverBox.top + 4, left: hoverBox.left }}
        >
          +
        </button>
      )}
    </div>
  );
};