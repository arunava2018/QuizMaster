import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Topic } from "@/models/Topics";
import { Question } from "@/models/Question";
import { TestInformation } from "@/models/TestInformation";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId");

    if (!topicId || !mongoose.Types.ObjectId.isValid(topicId)) {
      return NextResponse.json({ message: "Invalid topicId" }, { status: 400 });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    const questions = await Question.aggregate([
      { $match: { topicId: new mongoose.Types.ObjectId(topicId) } },
      { $sample: { size: 20 } },
    ]);

    if (questions.length === 0) {
      return NextResponse.json(
        { message: "No questions found for this topic" },
        { status: 404 }
      );
    }

    const test = await TestInformation.create({
      clerkUserId,
      topicId,
      questions: questions.map((q) => ({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
      score: 0,
      status: "in-progress",
      startedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Test started successfully", testId: test._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error starting test:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
