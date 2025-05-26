"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FaMoon, FaSun } from 'react-icons/fa6';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免 hydration 錯誤：只在 client side 顯示
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cancel-drag flex h-10 w-20 cursor-pointer items-center rounded-full bg-gray-200 transition duration-300 focus:outline-hidden lg:h-12 lg:w-24"
    >
      <div
        className={cn(
          `flex size-10 items-center justify-center rounded-full border-2 border-gray-200 text-white transition duration-300 lg:size-12 lg:border-4`,
          theme === "dark" ? "bg-[#363636] translate-x-full" : "bg-yellow-500"
        )}
      >
        {theme === "dark" ? <FaMoon /> : <FaSun />}
      </div>
    </button>
  );
}
