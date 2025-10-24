"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface QuizFooterProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onSubmit: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export default function QuizFooter({
  currentIndex,
  total,
  onNext,
  onSubmit,
  onSave,
  isSaved,
}: QuizFooterProps) {
  const isLast = currentIndex === total - 1;

  return (
    <div className="flex gap-4">
      <Button
        variant={isSaved ? "secondary" : "default"}
        onClick={onSave}
      >
        {isSaved ? "Saved" : "Save Response"}
      </Button>

      {!isLast ? (
        <Button onClick={onNext}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit Quiz
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Confirm Submission
              </AlertDialogTitle>
              <AlertDialogDescription>
                Once submitted, you cannot change your answers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSubmit}>
                Submit Now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
