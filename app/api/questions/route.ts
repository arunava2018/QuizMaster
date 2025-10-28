import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { Question } from "@/models/Question";
import { Topic } from "@/models/Topics";

// Add new question — only admins can do this
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    await connectDB();

    // Verify admin
    const admin = await AdminUser.findOne({ clerkUserId: userId });
    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized access." },
        { status: 403 }
      );
    }

    // Extract question data
    const { topicId, questionText, options, correctAnswer, difficulty, explanation } =
      await req.json();

    // Validate required fields
    if (!topicId || !questionText || !options || !correctAnswer) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Validate topic
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return NextResponse.json(
        { message: "Invalid topic ID." },
        { status: 404 }
      );
    }

    // Validate options
    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { message: "At least two options are required." },
        { status: 400 }
      );
    }

    // Ensure correct answer is in options
    if (!options.includes(correctAnswer)) {
      return NextResponse.json(
        { message: "Correct answer must be one of the options." },
        { status: 400 }
      );
    }

    // Create question
    const newQuestion = await Question.create({
      topicId,
      questionText,
      options,
      correctAnswer,
      difficulty: difficulty || "easy",
      explanation
    });

    return NextResponse.json(
      { message: "Question added successfully.", question: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding question:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// Fetch questions 
export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract topic filter from query params
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId");

    let query = {};
    if (topicId) {
      query = { topicId };
    }

    const questions = await Question.find(query)
      .populate("topicId", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
