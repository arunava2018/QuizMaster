"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle,
  CardContent, CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Loader2, Clock, CheckCircle2, CircleHelp } from "lucide-react";

export default function QuizResultPage() {
  const { testId } = useParams();
  const router = useRouter();

  const [score, setScore] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await fetch(`/api/quiz/${testId}/result`);
        const data = await res.json();

        if (data.success) {
          setScore(data.score);
          setTotalQuestions(data.totalQuestions);
          setAttempted(data.attempted);
          setAccuracy(data.accuracy);
          setTimeTaken(data.timeTaken);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
          <p className="text-muted-foreground text-sm">
            Here’s your performance summary:
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score and Progress */}
          <div className="space-y-2">
            <p className="text-center text-lg font-medium">Your Score</p>
            <p className="text-center text-5xl font-bold text-primary">{score}</p>
            <Progress value={accuracy} />
            <p className="text-center text-sm text-muted-foreground">{accuracy}% Accuracy</p>
          </div>

          <Separator />

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-semibold">{totalQuestions}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Attempted</p>
              <p className="text-xl font-semibold">{attempted}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Correct</p>
              <p className="text-xl font-semibold text-green-600">{score}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p className="text-lg font-medium">
              {minutes}m {seconds}s
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => router.push(`/quiz/review/${testId}`)}>
            Review Answers
          </Button>
          <Button className="w-full" variant="outline" onClick={() => router.push("/quiz")}>
            Browse More Quizzes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
