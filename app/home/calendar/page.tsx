"use client";

import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import AddEventDialog from "@/app/components/calendar/AddEventDialog";
import { CalendarEvent } from "@/types/event";
import { getEvents } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { updateEvent } from "@/lib/firestore";
import type { EventDropArg } from "@fullcalendar/core";

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectInfo, setSelectInfo] = useState<{ start: Date; end: Date } | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { user, loading } = useAuth();


  useEffect(() => {
    if (user) {
      getEvents(user.uid).then((data) => setEvents(data));
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  const handleSelect = (info: DateSelectArg) => {
    setSelectInfo({ start: info.start, end: info.end });
    setSelectedEvent(null); // 清除編輯狀態
    setDialogOpen(true);
  };

  const handleEventClick = (info: EventClickArg) => {
    const clickedEvent = events.find((e) => e.id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setSelectInfo({ start: clickedEvent.start, end: clickedEvent.end });
      setDialogOpen(true);
    }
  };

  function handleEventDrop(info: EventDropArg) {
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
  }

  function handleEventResize(info: any) {
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
  }
  

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        editable={true}
        headerToolbar={false}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        events={events.map((event) => ({
            ...event,
            start: event.start instanceof Date ? event.start.toISOString() : event.start,
            end: event.end instanceof Date ? event.end.toISOString() : event.end,
          }))}
      />

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
          onAdd={(event: CalendarEvent) => {
            setEvents((prev) => [...prev, event]);
          }}
          onUpdate={(updated: CalendarEvent) => {
            setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
          }}
          onDelete={(id: string) => {
            setEvents((prev) => prev.filter((e) => e.id !== id));
          }}
        />
      )}
    </>
  );
}
