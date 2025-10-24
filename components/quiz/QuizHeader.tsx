"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizHeaderProps {
  topicId: string | string[] | undefined;
  testId: string | string[] | undefined;
  timeLeft: number;
  onEnd: () => void;
}

export default function QuizHeader({
  topicId,
  testId,
  timeLeft,
  onEnd
}: QuizHeaderProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Quiz in Progress
        </h1>
        <p className="text-sm text-muted-foreground">
          Topic ID: <span className="font-medium">{topicId}</span> | Test ID:{" "}
          <span className="font-medium">{testId}</span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 shadow-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-semibold text-primary tracking-wide">
            {formatTime(timeLeft)}
          </span>
        </div>
        <Button onClick={onEnd} variant="destructive">End Quiz</Button>
      </div>
    </header>
  );
}
