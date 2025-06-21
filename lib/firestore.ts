import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
  where,
  setDoc,
  onSnapshot
} from "firebase/firestore";
import { Tag } from "@/types/tag";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { Note } from "@/types/note";
import { CalendarEvent } from "@/types/event";
import { ExcalidrawElement, AppState, BinaryFiles } from "@/types/excalidraw";



const NOTES_COLLECTION = "notes";

export const addNote = async (data: {
  title: string;
  content: string;
  tags?: string[];
  userId: string;
  order: number;
}) => {
  return await addDoc(collection(db, NOTES_COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateNote = async (id: string, data: Partial<Note>) => {
  const noteRef = doc(db, NOTES_COLLECTION, id);
  return await updateDoc(noteRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteNote = async (id: string) => {
  return await deleteDoc(doc(db, NOTES_COLLECTION, id));
};

export const getAllNotes = async (userId: string) => {
  const q = query(
    collection(db, NOTES_COLLECTION),
    where("userId", "==", userId),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Note, "id"> & { updatedAt: Timestamp };
    return {
      id: doc.id,
      ...data,
      updatedAt: data.updatedAt.toDate(),
    };
  });
};

//取得標籤
export const getTags = async (userId: string) => {
  const q = query(collection(db, "tags"), where("userID", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Tag[];
};

//新增標籤
export const addTag = async (name: string, color: string, userId: string) => {
  const tagRef = collection(db, "tags");
  return await addDoc(tagRef, { name, color, userId });
};

//刪除標籤
export async function deleteTag(tagId: string) {
  try {
    await deleteDoc(doc(db, "tags", tagId));
  } catch (err) {
    console.error("刪除標籤失敗", err);
    throw err;
  }
}

// 轉換時間格式
export function formatNoteDate(input: Date | string | Timestamp): string {
  let date: Date;

  if (input instanceof Timestamp) {
    date = input.toDate();
  } else if (typeof input === "string") {
    date = new Date(input);
  } else {
    date = input; // 假設是 Date
  }

  if (isNaN(date.getTime())) return ""; // 無效日期安全處理

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day}, ${month} ${year}`;
}

//登出
export async function logout() {
  try {
    await signOut(auth);
    console.log("使用者已登出");
  } catch (error) {
    console.error("登出失敗", error);
  }
}

// getEvents.ts
export async function getEvents(userId: string): Promise<CalendarEvent[]> {
  const q = query(collection(db, "events"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
      color: data.color,
      userId: data.userId,
      noteId: data.noteId ?? [],
    };
  });
}

// addEvent.ts
export async function addEvent(event: CalendarEvent) {
  await setDoc(doc(db, "events", event.id), {
    ...event,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
  });
}

// updateEvent.ts
export async function updateEvent(event: CalendarEvent) {
  await setDoc(doc(db, "events", event.id), {
    ...event,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
    noteId: event.noteId ?? [],
  });
}

// deleteEvent.ts
export async function deleteEvent(eventId: string) {
  await deleteDoc(doc(db, "events", eventId));
}

export const listenToNotes = (
  userId: string,
  callback: (notes: Note[]) => void
) => {
  const notesQuery = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("order", "asc")
  );

  const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Note[];
    callback(notes);
  });

  return unsubscribe;
};



// canvas

// export type DrawingData = {
//   userId: string; 
//   elements: any[]; 
//   appState: any; 
//   files?: Record<string, any>;
//   updatedAt: Timestamp;
// };

export type DrawingData = {
  userId: string;
  elements: ExcalidrawElement[];
  appState: Partial<AppState>;
  files?: BinaryFiles;
  updatedAt: Timestamp;
};

const DRAWING_COLLECTION = "excalidraw";

export const saveDrawing = async (
  userId: string,
  data: Omit<DrawingData, "updatedAt">
) => {
  const ref = doc(db, DRAWING_COLLECTION, userId);
  return await setDoc(ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const loadDrawing = async (userId: string) => {
  const docRef = doc(db, "excalidraw", userId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    id: snapshot.id,
    userId: data.userId,
    elements: JSON.parse(data.elements || "[]"),
    appState: JSON.parse(data.appState || "{}"),
    files: JSON.parse(data.files || "{}"),
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  };
};

// home / article
export async function getArticle(userId: string) {
  const docRef = doc(db, "articles", userId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

export async function saveArticle(
  userId: string,
  data: { title: string; content: string; link: string }
) {
  const docRef = doc(db, "articles", userId);
  return await setDoc(docRef, {
    ...data,
    userId,
    updatedAt: new Date(),
  });
}

// home / Link(Thread)
export async function getLink(userId: string) {
  const docRef = doc(db, "links", userId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

export async function saveLink(
  userId: string,
  data: { url: string; icon: string | null }
) {
  const docRef = doc(db, "links", userId);
  await setDoc(docRef, {
    ...data,
    userId,
    updatedAt: new Date(),
  });
}