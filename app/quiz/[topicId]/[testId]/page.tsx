"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import QuizHeader from "@/components/quiz/QuizHeader";
import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import QuizFooter from "@/components/quiz/QuizFooter";
import QuizNavigator from "@/components/quiz/QuizNavigator";

interface Question {
  questionId: string;
  questionText: string;
  options: string[];
}

export default function QuizPage() {
  const { topicId, testId } = useParams();
  const router = useRouter();
  const [submissionLoader, setSubmissionLoader] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tempSelection, setTempSelection] = useState<{ [key: string]: string }>(
    {}
  );
  const [savedAnswers, setSavedAnswers] = useState<{ [key: string]: string }>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes

  // Fetch quiz questions
  useEffect(() => {
    if (!testId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const res = await axios.get(`/api/quiz/${testId}`);

        if (res.data.success && res.data.questions?.length > 0) {
          setQuestions(res.data.questions);
        } else if (res.data.message === "Test already completed") {
          setCompleted(true);
          toast.info("This test has already been completed.");
        } else {
          toast.error("No questions found for this quiz");
          router.push("/quiz");
        }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          setCompleted(true);
          toast.info("This test has already been completed.");
        } else {
          toast.error("Failed to load quiz");
          router.push("/quiz");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [testId, router]);

  // Timer countdown
  useEffect(() => {
    if (loading) return;
    if (timeLeft <= 0) {
      toast.info("Time's up! Submitting your quiz...");
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setTempSelection((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSave = async () => {
    const qid = questions[currentIndex].questionId;
    if (!tempSelection[qid]) {
      toast.error("Please select an option before saving.");
      return;
    }

    setSavedAnswers((prev) => ({ ...prev, [qid]: tempSelection[qid] }));

    try {
      const res = await axios.post(`/api/quiz/${testId}`, {
        questionId: qid,
        selectedAnswer: tempSelection[qid],
      });

      if (res.data.success) toast.success("Answer saved successfully.");
      else toast.error("Failed to save answer.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save answer");
      console.error("Error saving answer:", error);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handleJump = (index: number) => setCurrentIndex(index);

  const handleSubmit = async () => {
    try {
      setSubmissionLoader(true);
      await axios.post(`/api/topics/${topicId}/attempts`);

      const timeTaken = 20 * 60 - timeLeft;
      await axios.post(`/api/quiz/${testId}/timer`, { timeTaken });

      toast.success("Quiz submitted. Redirecting to results...");
      setTimeout(() => {
        setSubmissionLoader(false);
        router.push(`/quiz/result/${testId}`);
      }, 1500);
    } catch (error) {
      console.error("Error recording user attempt:", error);
      toast.error("Failed to record user attempt.");
      setSubmissionLoader(false);
    }
  };

  // Initial loading animation
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-primary/60 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl font-semibold text-foreground">
            Preparing Your Quiz
          </h2>
          <p className="text-muted-foreground">
            Setting up questions and initializing your test environment...
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    );
  }

  // Completed test UI
  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white dark:bg-background rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Test Completed</h2>
          <p className="text-muted-foreground mb-6">
            This test session has already been completed. You can view your results or return to the quiz list.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/quiz/result/${testId}`)}
              className="px-6 py-2 bg-accent rounded hover:opacity-95"
            >
              View Results
            </button>
            <button
              onClick={() => router.push("/quiz")}
              className="px-6 py-2 border rounded"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  //Submission Loader
  if (submissionLoader) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        {/* Circular progress ring */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary/60 rounded-full animate-ping"></div>
          </div>
        </div>

        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl font-semibold text-foreground">
            Submitting Your Quiz
          </h2>
          <p className="text-muted-foreground">
            Please wait while we securely record your responses and calculate your score...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    );
  }

  // No questions fallback
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No questions found.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen">
      <QuizHeader onEnd={handleSubmit} topicId={topicId} testId={testId} timeLeft={timeLeft} />
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="flex gap-8">
          <div className="flex-1 space-y-6">
            <QuizQuestionCard
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              questionText={currentQuestion.questionText}
              options={currentQuestion.options}
              selectedAnswer={tempSelection[currentQuestion.questionId]}
              isSaved={!!savedAnswers[currentQuestion.questionId]}
              onSelect={(answer) =>
                handleAnswerSelect(currentQuestion.questionId, answer)
              }
            />

            <QuizFooter
              currentIndex={currentIndex}
              total={questions.length}
              onNext={handleNext}
              onSubmit={handleSubmit}
              onSave={handleSave}
              isSaved={!!savedAnswers[currentQuestion.questionId]}
            />
          </div>

          <div className="w-64 flex-shrink-0">
            <div className="sticky top-6">
              <QuizNavigator
                total={questions.length}
                currentIndex={currentIndex}
                savedAnswers={savedAnswers}
                tempSelection={tempSelection}
                questions={questions}
                onJump={handleJump}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
