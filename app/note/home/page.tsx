"use client";

import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import type { Layouts as GridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function HomePage() {
  const layout = [
    { i: "a", x: 0, y: 0, w: 4, h: 4 },
    { i: "b", x: 4, y: 0, w: 2, h: 4 },
    { i: "c", x: 2, y: 2, w: 4, h: 4 },
    { i: "d", x: 0, y: 2, w: 2, h: 4 },
    { i: "e", x: 0, y: 0, w: 2, h: 4 },
    { i: "f", x: 6, y: 0, w: 2, h: 8 },
    { i: "g", x: 4, y: 0, w: 4, h: 4 },
    { i: "h", x: 2, y: 4, w: 2, h: 4 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F7] px-10 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
      <main className="w-full max-w-6xl mx-auto">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 8, md: 8, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={40}
          useCSSTransforms={true}
          isDraggable={true}
          isResizable={true}
        >
          <div key="a" className="bg-red-400 rounded-lg p-4 text-white">
            Item A
          </div>
          <div key="b" className="bg-green-400 rounded-lg p-4 text-white">
            Item B
          </div>
          <div key="c" className="bg-blue-400 rounded-lg p-4 text-white">
            Item C
          </div>
          <div key="d" className="bg-purple-400 rounded-lg p-4 text-white">
            Item D
          </div>
          <div key="e" className="bg-orange-400 rounded-lg p-4 text-white">
            Item E
          </div>
          <div key="f" className="bg-fuchsia-400 rounded-lg p-4 text-white">
            Item F
          </div>
          <div key="g" className="bg-red-400 rounded-lg p-4 text-white">
            Item G
          </div>
          <div key="h" className="bg-fuchsia-400 rounded-lg p-4 text-white">
            Item H
          </div>
        </ResponsiveGridLayout>
      </main>
    </div>
  );
}
