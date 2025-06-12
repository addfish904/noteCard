"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Card from "../ui/card";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface Props {
  userUid: string | null;
}

export default function Todolist({ userUid }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!userUid) return;

    const q = query(
      collection(db, "todos"),
      where("userId", "==", userUid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTodos: Todo[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          completed: data.completed,
          createdAt: data.createdAt?.toDate(),
        };
      });

      setTodos(fetchedTodos);
    });

    return () => unsubscribe();
  }, [userUid]);

  const handleAddTodo = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "todos"), {
      text: input.trim(),
      completed: false,
      createdAt: new Date(),
      userId: userUid,
    });

    console.log(todos)
    setInput("");
  };

  const handleToggleCompleted = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "todos", id), {
      completed: !current,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <Card className="p-6">
      <h2 className="relative text-base font-bold mb-4 w-fit mx-auto before:content-[''] before:absolute before:w-2 before:h-2 before:rounded-full before:bg-blue-500 before:top-1/2 before:-translate-y-1/2 before:-left-4">Todolist</h2>

      <div className="cancel-drag flex items-center mb-4 h-[40px]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow w-full h-full px-4 py-2 border rounded-l-md border-gray-300 dark:bg-zinc-700 dark:text-white"
          placeholder="新增待辦事項"
        />
        <button
          onClick={handleAddTodo}
          className="bg-[var(--color-primary)] text-white rounded-r-md text-lg h-full px-3 hover:bg-[#323153] cursor-pointer dark:bg-[#D9F275] dark:text-black"
        >
          ＋
        </button>
      </div>

      <ul className="cancel-drag space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-gray-100 dark:bg-zinc-700 px-4 py-2 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleCompleted(todo.id, todo.completed)}
                className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
              />
              <span
                className={`${
                  todo.completed ? "line-through text-gray-500" : ""
                } dark:text-white`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-sm text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
