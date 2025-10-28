"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";

interface QuizQuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  selectedAnswer?: string;
  isSaved?: boolean;
  onSelect: (answer: string) => void;
  locked?: boolean;
}

export default function QuizQuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedAnswer,
  isSaved = false,
  onSelect,
  locked = false,
}: QuizQuestionCardProps) {
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">


      {/* Main Question Card */}
      <Card className={`border-2 shadow-lg transition-all duration-500 bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-sm ${
        isSaved 
          ? "border-green-200 shadow-green-100/50 dark:border-green-800 dark:shadow-green-900/20" 
          : selectedAnswer 
            ? "border-yellow-200 shadow-yellow-100/50 dark:border-yellow-800 dark:shadow-yellow-900/20"
            : "border-border/40 hover:shadow-xl"
      }`}>
        <CardHeader>
          <CardTitle className="text-md md:text-xl font-semibold leading-relaxed text-foreground">
            {questionText}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const optionLetter = String.fromCharCode(65 + index);

            // Enhanced highlight logic
            let highlightClass = "";
            let textColorClass = "";
            let badgeColorClass = "";
            let iconColorClass = "";

            if (isSelected && isSaved) {
              highlightClass = "border-green-500 bg-green-50 shadow-md shadow-green-200/50 dark:bg-green-900/20 dark:border-green-400";
              textColorClass = "text-green-700 dark:text-green-300 font-semibold";
              badgeColorClass = "bg-green-600 text-white border-green-600";
              iconColorClass = "text-green-600";
            } else if (isSelected && !isSaved) {
              highlightClass = "border-yellow-500 bg-yellow-50 shadow-md shadow-yellow-200/50 dark:bg-yellow-900/20 dark:border-yellow-400";
              textColorClass = "text-yellow-700 dark:text-yellow-300 font-medium";
              badgeColorClass = "bg-yellow-600 text-white border-yellow-600";
              iconColorClass = "text-yellow-600";
            } else {
              highlightClass = `border-border/30 hover:border-primary/40 hover:bg-muted/30 ${locked ? '' : 'cursor-pointer'}`;
              textColorClass = "text-foreground/90 hover:text-foreground";
              badgeColorClass = "border-primary/30 text-muted-foreground hover:border-primary/60 hover:text-foreground";
              iconColorClass = "text-muted-foreground/40 group-hover:text-muted-foreground/60";
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                whileHover={!locked && !isSaved ? { scale: 1.01, y: -1 } : {}}
                whileTap={!locked && !isSaved ? { scale: 0.98 } : {}}
              >
                <Button
                  type="button"
                  variant="ghost"
                  className={`w-full justify-start text-left p-4 h-auto min-h-[70px] rounded-xl border-2 transition-all duration-300 group relative overflow-hidden ${highlightClass} ${
                    locked || isSaved ? "cursor-not-allowed" : "hover:shadow-lg"
                  }`}
                  disabled={locked || isSaved}
                  onClick={() => !locked && !isSaved && onSelect(option)}
                >
                  {/* Enhanced Background Gradient */}
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    isSelected && isSaved
                      ? "opacity-100 bg-gradient-to-r from-green-100/80 to-green-50/60 dark:from-green-900/30 dark:to-green-800/20"
                      : isSelected && !isSaved
                        ? "opacity-100 bg-gradient-to-r from-yellow-100/80 to-yellow-50/60 dark:from-yellow-900/30 dark:to-yellow-800/20"
                        : "opacity-0 group-hover:opacity-100 bg-gradient-to-r from-muted/30 to-muted/10"
                  }`} />

                  <div className="flex items-center gap-4 relative z-10 w-full">
                    {/* Enhanced Option Badge */}
                    <div className={`flex-shrink-0 text-xs md:text-xl w-5 h-5 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 ${badgeColorClass}`}>
                      {optionLetter}
                    </div>

                    {/* Option Text */}
                    <span className={`flex-1 text-xs md:text-base  leading-relaxed transition-all duration-300 ${textColorClass}`}>
                      {option}
                    </span>

                    {/* Status Icons */}
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <>
                          <CheckCircle2 className={`w-5 h-5 ${iconColorClass}`} />
                          {isSaved && (
                            <Lock className="w-4 h-4 text-green-600" />
                          )}
                        </>
                      ) : (
                        <Circle className={`w-5 h-5 ${iconColorClass}`} />
                      )}
                    </div>
                  </div>

                </Button>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
