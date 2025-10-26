import { User } from "@/models/User";
import { Topic } from "@/models/Topics";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { clerkId: string } }) {
  try {
    const { clerkId } = params;
    await connectDB();

    const user = await User.findOne({ clerkUserId: clerkId })
      .populate("testInfo.topicId");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let totalTestsAttempted = 0;

    const topicsData = user.testInfo.map((test:any) => {
      const topic = test.topicId; 
      const scoreValues = test.scores.map((s:any) => s.score);

      totalTestsAttempted += scoreValues.length;

      return {
        topicId: topic._id.toString(),
        topicTitle: topic.title,
        scores: scoreValues,
        testAttempted: scoreValues.length,
      };
    });

    return NextResponse.json({
      success: true,
      totalTestsAttempted,
      topics: topicsData,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

