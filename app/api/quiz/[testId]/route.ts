import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { TestInformation } from "@/models/TestInformation";

interface LeanTest {
  _id: string;
  topicId: string;
  questions: {
    questionId: string;
    questionText: string;
    options: string[];
    correctAnswer?: string;
  }[];
}

export async function GET(
  req: Request,
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
