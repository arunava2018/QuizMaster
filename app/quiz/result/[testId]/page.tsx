"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Loader2, Clock, CheckCircle, Target, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const scorePercentage = totalQuestions > 0 ? Math.round((score! / totalQuestions) * 100) : 0;
  
  // Determine performance level
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { label: "Excellent", color: "bg-green-500", textColor: "text-green-700 dark:text-green-300" };
    if (percentage >= 75) return { label: "Good", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-300" };
    if (percentage >= 60) return { label: "Average", color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-300" };
    return { label: "Needs Improvement", color: "bg-red-500", textColor: "text-red-700 dark:text-red-300" };
  };

  const performance = getPerformanceLevel(scorePercentage);

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          
          <h1 className="text-3xl font-bold tracking-tight">Quiz Completed</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Here's a summary of your performance on this assessment.
          </p>
        </div>

        {/* Main Score Card */}
        <Card className="border-0 shadow-lg max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <Badge 
                variant="secondary" 
                className={`${performance.textColor} bg-transparent border-current px-4 py-2 text-sm font-medium`}
              >
                {performance.label}
              </Badge>
              
              <div className="space-y-2">
                <div className="text-6xl font-bold tracking-tight">
                  {score}<span className="text-3xl text-muted-foreground">/{totalQuestions}</span>
                </div>
                <div className="text-2xl font-semibold text-muted-foreground">
                  {scorePercentage}% Correct
                </div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-xs mx-auto">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${performance.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Questions Attempted
                  </p>
                  <p className="text-2xl font-bold">
                    {attempted}<span className="text-lg text-muted-foreground">/{totalQuestions}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Accuracy Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {accuracy}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Timer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Time Taken
                  </p>
                  <p className="text-2xl font-bold">
                    {minutes}m {seconds}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button variant="secondary" size="lg" className="min-w-[160px]" onClick={() => router.push(`/quiz/review/${testId}`)}>
            Review Answers
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push(`/quiz/${testId}`)}
            className="min-w-[160px]"
          >
            Retake Quiz
          </Button>
          <Button 
            size="lg"
            onClick={() => router.push("/quiz")}
            className="min-w-[160px]"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">
            Keep practicing to improve your performance!
          </p>
        </div>
      </div>
    </div>
  );
}
