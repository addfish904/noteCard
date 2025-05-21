'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 避免 hydration 錯誤：只在 client side 顯示
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="mt-4 px-4 py-2 border rounded text-black dark:text-white border-black dark:border-white"
    >
      {theme === 'dark' ? '☀️ 切換淺色' : '🌙 切換深色'}
    </button>
  )
}
