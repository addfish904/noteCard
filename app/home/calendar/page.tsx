"use client";

import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventDropArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import AddEventDialog from "@/app/components/calendar/AddEventDialog";
import { getEvents, updateEvent } from "@/lib/firestore";
import { CalendarEvent } from "@/types/event";
import { useNoteContext } from "@/app/context/NoteContext";

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectInfo, setSelectInfo] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const { user, loading } = useAuth();
  const [calendarView, setCalendarView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  >("timeGridWeek");
  const { notes, setSelectedNote } = useNoteContext();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const calendarApi = calendarRef.current?.getApi();

  const handleViewChange = (
    view: "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  ) => {
    setCalendarView(view);
    calendarApi?.changeView(view);
    setCurrentDate(calendarApi?.getDate() ?? new Date());
  };

  const handleToday = () => {
    calendarApi?.today();
    setCurrentDate(calendarApi?.getDate() ?? new Date());
  };

  const handlePrev = () => {
    calendarApi?.prev();
    setCurrentDate(calendarApi?.getDate() ?? new Date());
  };

  const handleNext = () => {
    calendarApi?.next();
    setCurrentDate(calendarApi?.getDate() ?? new Date());
  };

  useEffect(() => {
    if (user) {
      getEvents(user.uid).then((data) => setEvents(data));
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  const handleSelect = (info: DateSelectArg) => {
    setSelectInfo({ start: info.start, end: info.end });
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleEventClick = (info: EventClickArg) => {
    const clickedEvent = events.find((e) => e.id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setSelectInfo({ start: clickedEvent.start, end: clickedEvent.end });
      setDialogOpen(true);

      // 根據事件標題找對應 note 並選擇
      const matchingNote = notes.find(
        (note) => note.title === clickedEvent.title
      );
      if (matchingNote) {
        setSelectedNote(matchingNote);
      }
    }
  };

  const handleEventDrop = (info: EventDropArg) => {
    if (!user) return;
    const event = info.event;
    const updatedEvent: CalendarEvent = {
      id: event.id,
      title: event.title,
      start: event.start!,
      end: event.end || new Date(event.start!.getTime() + 30 * 60 * 1000),
      color: event.backgroundColor,
      userId: user.uid,
    };

    updateEvent(updatedEvent)
      .then(() => {
        setEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
      })
      .catch((error) => {
        console.error("事件更新失敗：", error);
        info.revert();
      });
  };

  const handleEventResize = (info: EventResizeDoneArg) => {
    if (!user) return;
    const event = info.event;
    const updatedEvent: CalendarEvent = {
      id: event.id,
      title: event.title,
      start: event.start!,
      end: event.end || new Date(event.start!.getTime() + 30 * 60 * 1000),
      color: event.backgroundColor,
      userId: user.uid,
    };

    updateEvent(updatedEvent)
      .then(() => {
        setEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
      })
      .catch((error) => {
        console.error("事件更新失敗：", error);
        info.revert();
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap items-center justify-between w-full px-8 py-2 my-2">
        <div className="flex items-center gap-10">
          <span className="text-2xl font-medium min-w-[180px]">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <div className="flex gap-4">
            <button
              onClick={handleToday}
              className="text-sm px-6 py-2 border border-gray-200/45 rounded-full bg-[#F4F6F8] hover:bg-gray-100 cursor-pointer dark:bg-black text-gray-800 dark:text-white" 
            >
              Today
            </button>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="group items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-white p-2 transition-all duration-300
           ring-2 ring-gray-200/45 hover-within:ring-4 hover:ring-4 dark:ring-gray-200/30 dark:bg-black cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="group items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-white p-2 transition-all duration-300
           ring-2 ring-gray-200/45 hover-within:ring-4 hover:ring-4 dark:ring-gray-200/30 dark:bg-black cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-1 px-4 py-2 m-2 bg-[#F4F6F8] rounded-full dark:bg-black">
          {["Month", "Week", "Day"].map((label, idx) => {
            const value = ["dayGridMonth", "timeGridWeek", "timeGridDay"][
              idx
            ] as typeof calendarView;
            const isActive = calendarView === value;
            return (
              <button
                key={value}
                onClick={() => handleViewChange(value)}
                className="relative px-6 py-2 rounded-full z-10"
              >
                {isActive && (
                  <motion.div
                    layoutId="tabHighlight"
                    className="absolute inset-0 bg-[var(--color-primary)] rounded-full z-0"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? "text-white" : "text-gray-800 dark:text-white"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={calendarView}
          selectable={true}
          editable={true}
          headerToolbar={false}
          allDaySlot={false}
          slotMinTime="01:00:00"
          slotMaxTime="24:00:00"
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          datesSet={({ start }) => setCurrentDate(start)}
          events={events.map((event) => ({
            ...event,
            start:
              event.start instanceof Date
                ? event.start.toISOString()
                : event.start,
            end:
              event.end instanceof Date ? event.end.toISOString() : event.end,
          }))}
        />
      </div>

      {dialogOpen && user && (
        <AddEventDialog
          open={dialogOpen}
          setOpen={(open) => {
            setDialogOpen(open);
            if (!open) {
              setSelectInfo(null);
              setSelectedEvent(null);
            }
          }}
          start={selectInfo?.start ?? new Date()}
          end={selectInfo?.end ?? new Date()}
          userId={user.uid}
          editingEvent={selectedEvent}
          onAdd={(event: CalendarEvent) =>
            setEvents((prev) => [...prev, event])
          }
          onUpdate={(updated: CalendarEvent) =>
            setEvents((prev) =>
              prev.map((e) => (e.id === updated.id ? updated : e))
            )
          }
          onDelete={(id: string) =>
            setEvents((prev) => prev.filter((e) => e.id !== id))
          }
        />
      )}
    </div>
  );
}
