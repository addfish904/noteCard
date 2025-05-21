// lib/firestore.ts
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
} from "firebase/firestore";

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
