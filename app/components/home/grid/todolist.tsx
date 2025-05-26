'use client';

import { useState } from 'react';
import Card from '../ui/card';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Card className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">My Todo List</h1>

      <div className="flex mb-4 cancel-drag">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-grow w-full px-4 py-2 border rounded-l-xl bg-white focus:ring-2 focus:ring-blue-400"
          placeholder="Add a new task"
        />
        <button
          onClick={addTodo}
          className="bg-[var(--color-primary)] text-white px-3 py-2 rounded-r-xl hover:bg-blue-600"
        >
          +
        </button>
      </div>

      <ul className="space-y-2 cancel-drag">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-xl"
          >
            <span
              className={`flex-1 cursor-pointer ${
                todo.completed ? 'line-through text-gray-400' : ''
              }`}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
