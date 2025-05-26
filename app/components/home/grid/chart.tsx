"use client";

import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { MonthlyNoteCount } from "@/lib/utils";
import Card from "../ui/card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function Chart({ data }: { data: MonthlyNoteCount[] }) {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "每月筆記數量",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(79,71,230,70%)",
        borderRadius: 8, 
        barThickness: 30,
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
    <Card className="w-full max-w-3xl mx-auto p-4">
      <h3>每月筆記</h3>
      <Bar data={chartData} options={options} />
    </Card>
  );
}
