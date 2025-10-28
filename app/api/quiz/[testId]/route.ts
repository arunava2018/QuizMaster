import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { TestInformation } from "@/models/TestInformation";
import { auth } from "@clerk/nextjs/server";

interface LeanTest {
  _id: string;
  topicId: string;
  status?: string;
  questions: {
    questionId: string;
    questionText: string;
    options: string[];
    correctAnswer?: string;
  }[];
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await context.params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return NextResponse.json({ message: "Invalid test ID" }, { status: 400 });
    }

    const test = (await TestInformation.findById(testId).lean()) as LeanTest | null;

    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }
    if(test.status === 'completed'){
      return NextResponse.json({ message: "Test already completed" }, { status: 403 });
    }
    const sanitizedQuestions = test.questions.map((q) => ({
      questionId: q.questionId,
      questionText: q.questionText,
      options: q.options,
    }));

    return NextResponse.json({
      success: true,
      testId: test._id,
      topicId: test.topicId,
      questions: sanitizedQuestions,
    });
  } catch (error: any) {
    console.error("Error fetching test:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(
  req: Request,
  context: { params: Promise<{ testId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const { testId } = await context.params;
    const { questionId, selectedAnswer } = await req.json();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(testId) || !mongoose.Types.ObjectId.isValid(questionId)) {
      return NextResponse.json({ success: false, message: "Invalid IDs" });
    }

    const test = await TestInformation.findOne({ _id: testId, clerkUserId: userId });
    if (!test) {
      return NextResponse.json({ success: false, message: "Test not found" });
    }

    const existingResponse = test.responses.find(
      (r: any) => r.questionId.toString() === questionId
    );

    if (existingResponse) {
      existingResponse.selectedAnswer = selectedAnswer;
    } else {
      test.responses.push({ questionId, selectedAnswer });
    }

    await test.save();

    return NextResponse.json({ success: true, message: "Response saved." });
  } catch (error) {
    console.log("Save response error:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}