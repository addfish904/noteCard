export type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color: string;
    userId: string | null;
    noteId?: string[];
  };
  