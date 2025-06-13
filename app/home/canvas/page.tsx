// "use client";

// import dynamic from "next/dynamic";
// import "@excalidraw/excalidraw/index.css";

// const Excalidraw = dynamic(
//   async () => (await import("@excalidraw/excalidraw")).Excalidraw,
//   {
//     ssr: false,
//   },
// );
// export default function App() {
//   return <Excalidraw
//   initialData={{
//     appState: {
//       viewBackgroundColor: "#f3f5f7",
//     },
//   }} />;
// }

"use client";

import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import { useTheme } from "next-themes"; // 假設你用 next-themes 管理 dark mode

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

export default function DrawingPage() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div className="w-full h-screen">
      <Excalidraw
        theme={isDark ? "dark" : "light"}
        initialData={{
          appState: {
            viewBackgroundColor: isDark ? "#292929" : "#f3f5f7",
          },
        }}
      />
    </div>
  );
}
