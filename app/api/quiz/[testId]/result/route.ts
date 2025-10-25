import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { TestInformation } from "@/models/TestInformation";
import { User } from "@/models/User";

export async function GET(request: Request, { params }: { params: { testId: string } }) {
  try {
    await connectDB();
    const { testId } = params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return NextResponse.json({ success: false, message: "Invalid test id" }, { status: 400 });
    }

    const testInfo = await TestInformation.findById(testId);
    if (!testInfo) {
      return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });
    }

    const totalQuestions = testInfo.questions.length;
    const attempted = (testInfo.responses || []).filter((r: any) => r.selectedAnswer != null).length;

    // If score was previously calculated, just return the stored stats
    if (testInfo.calculatedScore) {
      const accuracy = totalQuestions > 0 ? Math.round((testInfo.score / totalQuestions) * 100) : 0;

      return NextResponse.json({
        success: true,
        message: "Test already completed",
        score: testInfo.score,
        totalQuestions,
        attempted,
        accuracy,
        timeTaken: testInfo.timeTaken || 0,
      }, { status: 200 });
    }

    // Calculate Score if not done
    let score = 0;

    (testInfo.responses as any[]).forEach((response: any) => {
      const question = (testInfo.questions as any[]).find(
        (q: any) => q.questionId.toString() === response.questionId.toString()
      );
      if (question && response.selectedAnswer === question.correctAnswer) {
        score += 1;
        response.isCorrect = true;
      } else {
        response.isCorrect = false;
      }
    });

    testInfo.score = score;
    testInfo.calculatedScore = true;
    testInfo.status = "completed";
    testInfo.completedAt = new Date();
    testInfo.markModified("responses");
    await testInfo.save();

    // Store score in User Performance History
    const user = await User.findOne({ clerkUserId: testInfo.clerkUserId });
    if (user) {
      const topicIdStr = testInfo.topicId.toString();
      const topicEntry = (user.testInfo || []).find((t: any) => t.topicId.toString() === topicIdStr);
      const scoreRecord = { score, attemptedAt: new Date() };

      if (topicEntry) {
        topicEntry.scores = topicEntry.scores || [];
        topicEntry.scores.push(scoreRecord);
      } else {
        user.testInfo = user.testInfo || [];
        user.testInfo.push({
          topicId: testInfo.topicId,
          scores: [scoreRecord],
        });
      }

      await user.save();
    }

    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return NextResponse.json({
      success: true,
      message: "Test completed",
      score,
      totalQuestions,
      attempted,
      accuracy,
      timeTaken: testInfo.timeTaken || 0,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error calculating test result:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error: error?.message
    }, { status: 500 });
  }
}
