"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Shield,
  Save,
  Timer,
  Monitor,
} from "lucide-react";

interface Topic {
  _id: string;
  title: string;
  description: string;
  userAttempted: number;
}

interface QuizDisclaimerProps {
  topic: Topic;
}

export default function QuizDisclaimer({ topic }: QuizDisclaimerProps) {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [acknowledgedRules, setAcknowledgedRules] = useState(false);

  const canStart = agreedToTerms && acknowledgedRules;

  const handleStartQuiz = async () => {
    try {
      const res = await axios.post(`/api/quiz/start?topicId=${topic._id}`);
      const { testId } = res.data;

      if (!testId) {
        toast.error("Failed to initialize test session");
        return;
      }

      toast.success("Quiz started successfully");
      router.push(`/quiz/${topic._id}/${testId}`);
    } catch (err: any) {
      console.error("Error starting quiz:", err);
      toast.error(err.response?.data?.message || "Failed to start quiz");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl border shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Assessment Instructions
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Please review the guidelines before starting your assessment
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Assessment Overview */}
          <div className="space-y-4 text-center">
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-3">{topic.title}</h3>              
              <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-sm font-medium">20 Questions</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-sm font-medium">20 Minutes</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>

                <div className="text-center">
                  <FileCheck className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-sm font-medium">Equal Points</div>
                  <div className="text-xs text-muted-foreground">No Negative</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-700 dark:text-amber-300">
              <strong>Time-bound Assessment:</strong> Once started, the timer cannot be paused. 
              Ensure stable internet connection for uninterrupted experience.
            </AlertDescription>
          </Alert>

          <Separator />

          {/* Assessment Guidelines */}
          <div className="space-y-6">
            <h3 className="font-medium text-base">Assessment Guidelines</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Save className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Response Evaluation</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Only saved responses will be evaluated. Ensure you click "Save" or "Next" 
                      for each question before proceeding.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Timer className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Time Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Auto-submission occurs when time expires. Unsaved progress 
                      will not be counted toward your final score.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Monitor className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Browser Requirements</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maintain focus on this tab. Switching tabs or minimizing 
                      may trigger security protocols and auto-submission.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Shield className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Academic Integrity</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete independently without external assistance. 
                      Maintain academic honesty throughout the assessment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Technical Support</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      For technical issues during the assessment, contact support 
                      immediately. Do not refresh or navigate away from the page.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <FileCheck className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Answer Submission</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Review answers carefully before final submission. 
                      Changes cannot be made after completing the assessment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Confirmation Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-base">Confirmation Required</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                  I understand the assessment guidelines and confirm that only saved responses 
                  will be evaluated. I acknowledge this is a timed, independent evaluation.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="rules"
                  checked={acknowledgedRules}
                  onCheckedChange={(checked) => setAcknowledgedRules(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="rules" className="text-sm cursor-pointer leading-relaxed">
                  I have a stable internet connection and understand that auto-submission 
                  will occur when time expires or if I navigate away from the assessment.
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              disabled={!canStart}
              onClick={handleStartQuiz}
              className="px-8"
            >
              Start Assessment
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Questions or technical issues? Contact support before starting
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
