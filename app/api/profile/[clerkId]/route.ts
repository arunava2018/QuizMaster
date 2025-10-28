import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import "@/models/Topics";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await context.params;
    await connectDB();

    const user = await User.findOne({ clerkUserId: clerkId }).populate({
      path: "testInfo.topicId",
      model: "Topic",
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let totalTestsAttempted = 0;

    const topicsData = (user.testInfo || []).map((test: any) => {
      const topic = test.topicId;

      // Prevent issues if topic is missing or not populated
      if (!topic) return null;

      const scoreValues = (test.scores || []).map((s: any) => s.score);
      totalTestsAttempted += scoreValues.length;

      return {
        topicId: topic._id.toString(),
        topicTitle: topic.title,
        scores: scoreValues,
        testAttempted: scoreValues.length,
      };
    }).filter(Boolean); // Remove null entries safely

    return NextResponse.json({
      success: true,
      totalTestsAttempted,
      topics: topicsData,
    });
  } catch (error: any) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
