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
export const addTag = async (name: string, userId: string) => {
  const tagRef = collection(db, "tags");
  return await addDoc(tagRef, { name, userId });
};
