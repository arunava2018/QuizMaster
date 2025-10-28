import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { TestInformation } from "@/models/TestInformation";
import { Question } from "@/models/Question";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await context.params; // Await params
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return NextResponse.json({ success: false, message: "Invalid test id" }, { status: 400 });
    }

    const testInfo = await TestInformation.findById(testId);
    if (!testInfo) {
      return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });
    }

    // Build review data
    const reviewData = await Promise.all(
      (testInfo.questions as any[]).map(async (question) => {
        const response = (testInfo.responses as any[]).find(
          (r: any) => r.questionId.toString() === question.questionId.toString()
        );

        // Fetch explanation from the Question model
        const fullQuestionData = await Question.findById(question.questionId).select("explanation");

        return {
          questionId: question.questionId,
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          selectedAnswer: response?.selectedAnswer || null,
          isCorrect: response?.isCorrect ?? false,
          explanation: fullQuestionData?.explanation || "No explanation provided",
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        score: testInfo.score,
        timeTaken: testInfo.timeTaken,
        review: reviewData,
      },
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
