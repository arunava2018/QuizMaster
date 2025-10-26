"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lightbulb, Clock, Trophy } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import axios from "axios";

export default function QuizReviewPage() {
  const { testId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testId) return;

    const fetchReview = async () => {
      try {
        const res = await axios.get(`/api/quiz/${testId}/review`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchReview();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <Item variant="outline">
          <ItemMedia>
            <Spinner className="h-6 w-6" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Loading your test review</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-500">
        Failed to load review data. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6">Quiz Review</h1>

      <div className="flex justify-center gap-6 mb-8 text-lg font-medium">
        <p className="flex items-center gap-1">
          <Trophy className="h-5 w-5" /> Score:{" "}
          <span className="font-bold text-green-600">{data.score}</span>
        </p>
        <p className="flex items-center gap-1">
          <Clock className="h-5 w-5" /> Time Taken:{" "}
          <span className="font-bold text-blue-600">{data.timeTaken} secs</span>
        </p>
      </div>

      {/* Review List */}
      <div className="space-y-8">
        {data.review.map((item: any, index: number) => {
          const isCorrect = item.isCorrect;
          const notAttempted = item.selectedAnswer === null;

          return (
            <div
              key={index}
              className="p-6 border rounded-xl shadow-sm bg-white text-black dark:bg-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700"
            >
              <h2 className="font-semibold text-lg mb-3">
                {index + 1}. {item.questionText}
              </h2>

              {/* Options */}
              <ul className="space-y-2">
                {item.options.map((opt: string, i: number) => {
                  const isUserChoice = item.selectedAnswer === opt;
                  const isAns = item.correctAnswer === opt;

                  return (
                    <li
                      key={i}
                      className={`
                        px-3 py-2 rounded-md border transition
                        ${
                          isAns
                            ? "bg-green-100 text-green-800 border-green-500 dark:bg-green-900 dark:text-green-200"
                            : ""
                        }
                        ${
                          isUserChoice && !isAns
                            ? "bg-red-100 text-red-800 border-red-500 dark:bg-red-900 dark:text-red-200"
                            : ""
                        }
                        ${
                          !isAns && !isUserChoice
                            ? "bg-transparent dark:bg-transparent border-neutral-300 dark:border-neutral-700"
                            : ""
                        }
                      `}
                    >
                      {opt}
                    </li>
                  );
                })}
              </ul>

              {/* Selected / Not Attempted */}
              <p className="mt-3 text-sm italic">
                {notAttempted ? (
                  <span className="text-orange-600">Not Attempted</span>
                ) : (
                  <span>
                    Your Answer:{" "}
                    <span
                      className={
                        isCorrect
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {item.selectedAnswer}
                    </span>
                  </span>
                )}
              </p>

              {/* Explanation */}
              <div className="mt-4 p-3 rounded-md border bg-gray-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <div className="flex">
                  <Lightbulb className="h-5 w-5" />
                  <p className="font-medium">Explanation:</p>
                </div>
                <p className="text-sm mt-1 text-neutral-700 dark:text-neutral-300">
                  {item.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
