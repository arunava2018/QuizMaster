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
  onEnd,
}: QuizHeaderProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-6 px-4 sm:px-6 lg:px-8 py-3 border-b border-border/50">
      {/* Title Section */}
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Quiz in Progress
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Stay focused — every second counts!
        </p>
      </div>

      {/* Timer + End Button */}
      <div className="flex flex-row items-center justify-between sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
        <div className="flex items-center justify-between sm:justify-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 shadow-sm">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-primary tracking-wide text-sm sm:text-base">
            {formatTime(timeLeft)}
          </span>
        </div>

        <Button
          onClick={onEnd}
          variant="destructive"
          
        >
          End Quiz
        </Button>
      </div>
    </header>
  );
}
