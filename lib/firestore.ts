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


const NOTES_COLLECTION = "notes";

export const addNote = async (data: {
    title: string;
    content: string;
    tags?: string[];
    userId: string;
    order: number
  }) => {
    const now = Timestamp.now();
    return await addDoc(collection(db, NOTES_COLLECTION), {
      ...data,
      createdAt: now,
      updatedAt: now,
      order: 0
    });
  };
  
export const updateNote = async (id: string, data: Partial<any>) => {
  const noteRef = doc(db, NOTES_COLLECTION, id);
  return await updateDoc(noteRef, {
    ...data,
    updatedAt: Timestamp.now(),
    order: 0
  });
};

export const deleteNote = async (id: string) => {
  return await deleteDoc(doc(db, NOTES_COLLECTION, id));
};

export const getAllNotes = async () => {
  const q = query(collection(db, NOTES_COLLECTION), orderBy("order", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};




export const getTags = async (userID: string) => {
  const q = query(collection(db, "tags"), where("userID", "==", userID));
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
export function formatNoteDate(timestampOrString: Timestamp | string): string {
  let date: Date;

  if (typeof timestampOrString === 'string') {
    date = new Date(timestampOrString); // 將 ISO 字串轉成 Date
  } else {
    date = timestampOrString.toDate(); // Firebase Timestamp 轉 Date
  }

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
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