"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";

interface Topic {
  topicId: string;
  topicTitle: string;
  scores: number[];
}

interface Props {
  topics: Topic[];
}

export default function UserTopicProgress({ topics }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!topics || topics.length === 0) return null;

  const maxAttempts = Math.max(...topics.map((t) => t.scores.length));
  if (maxAttempts === 0) return null;

  const chartData = Array.from({ length: maxAttempts }, (_, i) => {
    const row: any = { attempt: i + 1 };
    topics.forEach((topic) => (row[topic.topicTitle] = topic.scores[i] ?? null));
    return row;
  });

  const barColor = (index: number) => `var(--chart-${(index % 5) + 1})`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-popover text-foreground border border-border rounded-md px-3 py-2 shadow-md backdrop-blur-sm">
        <p className="font-medium text-sm mb-1">Attempt {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-2 text-sm">
            <span>{entry.dataKey}</span>
            <span className="font-semibold">{entry.value}/20</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl font-semibold">
          Topic-wise Score Progress
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Each bar represents score out of 20 per attempt
        </p>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        <div className={isMobile ? "h-72" : "h-96"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />

              <XAxis
                dataKey="attempt"
                tick={{ fill: "var(--foreground)", fontSize: isMobile ? 10 : 12 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />

              <YAxis
                domain={[0, 20]}
                ticks={[0, 5, 10, 15, 20]}
                tick={{ fill: "var(--foreground)", fontSize: isMobile ? 10 : 12 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {topics.map((topic, index) => (
                <Bar
                  key={topic.topicId}
                  dataKey={topic.topicTitle}
                  fill={barColor(index)}  
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
