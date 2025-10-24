"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function QuizResultPage() {
  const { testId } = useParams();
  const router = useRouter();

  // Dummy values (replace later when evaluation is ready)
  const score = 7;
  const totalQuestions = 10;
  const timeTaken = 340; // seconds → 5 min 40 sec

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold mb-4">🎉 Quiz Completed!</h1>

      <div className="bg-card p-6 rounded-xl shadow-md border space-y-4 w-full max-w-md">
        <div>
          <p className="text-lg font-medium">Your Score</p>
          <p className="text-4xl font-bold text-primary">
            {score} / {totalQuestions}
          </p>
        </div>

        <div>
          <p className="text-lg font-medium">Time Taken</p>
          <p className="text-xl font-semibold">
            {minutes}m {seconds}s
          </p>
        </div>

        <div className="pt-4 space-y-2">
          <Button className="w-full" onClick={() => router.push("/quiz")}>
            Retry Quiz List
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
