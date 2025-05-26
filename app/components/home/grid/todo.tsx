"use client";

import { useState } from "react";
import Card from "../ui/card";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Todo() {
  const [value, setValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = () => {
    if (value.trim() === "") return;
    const newTodo = {
        id: Date.now(),
        text: value,
        
    }
  };

  return (
    <Card>
      <h1>To do list</h1>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={addTodo}>新增</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li>
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
