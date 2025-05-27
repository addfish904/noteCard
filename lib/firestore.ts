import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where
} from "firebase/firestore";
import { Tag } from "@/types/tag";
import { auth } from './firebase';
import { signOut } from "firebase/auth";
import { Note } from "@/types/note";


const NOTES_COLLECTION = "notes";

export const addNote = async (data: {
    title: string;
    content: string;
    tags?: string[];
    userId: string;
    order: number
  }) => {
    return await addDoc(collection(db, NOTES_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };
  
export const updateNote = async (id: string, data: Partial<any>) => {
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
    const data = doc.data() as Omit<Note, "id">& { updatedAt: Timestamp };
    return {
      id: doc.id,
      ...data,
      updatedAt: data.updatedAt.toDate(),
    };
  });
};


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