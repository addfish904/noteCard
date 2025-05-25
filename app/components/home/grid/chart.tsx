"use client";

import { Line } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";
import { MonthlyNoteCount } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

export default function Chart({ data }: { data: MonthlyNoteCount[] }) {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "每月筆記數量",
        data: data.map((item) => item.count),
        borderColor: "#4f46e5", // Tailwind indigo-600
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <Line data={chartData} options={options} />
    </div>
  );
}
