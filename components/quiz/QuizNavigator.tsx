"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuizNavigatorProps {
  total: number;
  currentIndex: number;
  savedAnswers: { [key: string]: string };
  tempSelection: { [key: string]: string };
  questions: { questionId: string }[];
  onJump: (index: number) => void;
}

export default function QuizNavigator({
  total,
  currentIndex,
  savedAnswers,
  tempSelection,
  questions,
  onJump,
}: QuizNavigatorProps) {
  // Calculate statistics
  const savedCount = Object.keys(savedAnswers).length;
  const tempCount = Object.keys(tempSelection).filter(
    (qId) => !savedAnswers[qId]
  ).length;
  const unansweredCount = total - savedCount - tempCount;

  return (
    <div className="space-y-6">
      {/* Text-only Statistics */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Progress</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-green-600 font-medium">Answered:</span>
            <span className="font-semibold text-green-600">{savedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-600 font-medium">Marked as Review:</span>
            <span className="font-semibold text-yellow-600">{tempCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Remaining:</span>
            <span className="font-semibold text-gray-600">
              {unansweredCount}
            </span>
          </div>
        </div>
        <div className="border-b border-border/30 mt-3"></div>
      </div>

      {/* Question Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Questions</h3>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, index) => {
            const saved = !!savedAnswers[q.questionId];
            const temp = !!tempSelection[q.questionId] && !saved;
            const isCurrent = currentIndex === index;

            let buttonClass = "";
            let statusIcon = null;

            if (saved) {
              buttonClass =
                "bg-green-600 hover:bg-green-700 text-white border-green-600 dark:border-green-600 dark:bg-green-600 dark:hover:bg-green-700 ";
            } else if (temp) {
              buttonClass =
                "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 dark:border-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600";
            } else {
              buttonClass =
                "bg-muted hover:bg-muted/80 text-muted-foreground border-border dark:border-border";
            }

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full h-10 p-0 rounded font-semibold transition-all duration-200 border",
                    buttonClass,
                    isCurrent && "ring-2 ring-primary ring-offset-1"
                  )}
                  onClick={() => onJump(index)}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-bold">{index + 1}</span>
                    
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Text-only Legend */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Legend</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-green-600">●</span>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">●</span>
            <span>Marked as Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">●</span>
            <span>Not Attempted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
