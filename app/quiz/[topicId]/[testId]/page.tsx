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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Temporary selection (not saved)
  const [tempSelection, setTempSelection] = useState<{ [key: string]: string }>(
    {}
  );

  // Saved responses (final)
  const [savedAnswers, setSavedAnswers] = useState<{ [key: string]: string }>(
    {}
  );

  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes

  useEffect(() => {
    if (!testId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        // create a small delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 500ms delay
        const res = await axios.get(`/api/quiz/${testId}`);

        if (res.data.success && res.data.questions?.length > 0) {
          setQuestions(res.data.questions);
        } else {
          toast.error("No questions found for this quiz");
          router.push("/quiz");
        }
      } catch (error) {
        toast.error("Failed to load quiz");
        router.push("/quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [testId, router]);

  // Timer
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

  const handleSave = () => {
    const qid = questions[currentIndex].questionId;
    if (!tempSelection[qid]) {
      toast.error("Please select an option before saving.");
      return;
    }
    setSavedAnswers((prev) => ({ ...prev, [qid]: tempSelection[qid] }));
    toast.success("Response saved.");
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };

  const handleJump = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSubmit = () => {
    toast.success("Quiz submitted. Evaluation coming soon.");
    console.log("Final Saved Answers:", savedAnswers);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        {/* Animated Spinner */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-16 h-16 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-primary/60 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl font-semibold text-foreground">
            Preparing Your Quiz
          </h2>
          <p className="text-muted-foreground">
            Setting up questions and initializing your test environment...
          </p>
        </div>

        {/* Progress Indicator */}
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
      <QuizHeader
        onEnd={handleSubmit}
        topicId={topicId}
        testId={testId}
        timeLeft={timeLeft}
      />

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
