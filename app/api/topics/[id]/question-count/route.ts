import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";
import mongoose from "mongoose";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();

    // Validate topicId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid topic ID." },
        { status: 400 }
      );
    }

    // Count questions for this topic
    const count = await Question.countDocuments({ topicId : id});

    return NextResponse.json(
      { id, questionCount: count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching question count:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
