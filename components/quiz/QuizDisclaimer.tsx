"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Clock,
  BookOpen,
  User,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Monitor,
  FileText,
  Award,
  Info,
} from "lucide-react";
import { useState } from "react";

interface Topic {
  _id: string;
  title: string;
  description: string;
  userAttempted: number;
}

interface QuizDisclaimerProps {
  topic: Topic;
  onStart: () => void;
}

export default function QuizDisclaimer({ topic, onStart }: QuizDisclaimerProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [acknowledgedRules, setAcknowledgedRules] = useState(false);

  const canStart = agreedToTerms && acknowledgedRules;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-6xl shadow-2xl border-border/50">
        <CardHeader className="text-center pb-4 border-b">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Assessment Guidelines
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Review the information and confirm before starting your assessment
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - QUIZ INFO */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <FileText className="w-6 h-6 text-primary mt-1" />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
                    <p className="text-md text-muted-foreground leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-background/50 rounded-lg p-4">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-md">20 Questions</div>
                      <div className="text-sm text-muted-foreground">
                        Total Items
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background/50 rounded-lg p-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-md">20 Minutes</div>
                      <div className="text-sm text-muted-foreground">
                        Time Limit
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background/50 rounded-lg p-4">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-md">
                        {topic.userAttempted.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Test Takers
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background/50 rounded-lg p-4">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-md">No Negative Marking</div>
                      <div className="text-sm text-muted-foreground">
                        Equal Weightage
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NOTICE */}
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-200 text-lg">
                  Important Notice
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2 space-y-2">
                  <p>
                    This is a <strong>timed assessment</strong>. Once started, the timer
                    cannot be paused or reset.
                  </p>
                  <p className="text-sm">
                    Ensure a stable internet connection throughout the test.
                    Auto-submission will occur when time expires.
                  </p>
                </AlertDescription>
              </Alert>
            </div>

            {/* RIGHT SIDE - RULES & CONSENT */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Assessment Rules & Guidelines
                </h3>

                <div className="grid sm:grid-cols-1 gap-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Timer className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Time Management</h4>
                        <p className="text-sm text-muted-foreground">
                          The timer begins as soon as you start. Manage your time carefully across all questions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Monitor className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Browser Guidelines</h4>
                        <p className="text-sm text-muted-foreground">
                          Avoid switching tabs or minimizing the window. This may lead to auto-submission.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Academic Integrity</h4>
                        <p className="text-sm text-muted-foreground">
                          Complete this test independently. External assistance is strictly prohibited.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONSENT */}
              <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg mb-4">
                  Confirmation Required
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) =>
                        setAgreedToTerms(checked as boolean)
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I have read and understand the assessment guidelines, rules, and
                      requirements. I acknowledge that this is a timed, independent evaluation.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="rules"
                      checked={acknowledgedRules}
                      onCheckedChange={(checked) =>
                        setAcknowledgedRules(checked as boolean)
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="rules"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I understand that auto-submission will occur when time expires, and
                      I confirm I have a stable internet connection.
                    </label>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-5"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
                <Button
                  size="lg"
                  className={`px-8 relative overflow-hidden ${
                    canStart
                      ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!canStart}
                  onClick={onStart}
                >
                  {canStart && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Start Assessment
                  </span>
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Need help? Contact support before starting the assessment.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
