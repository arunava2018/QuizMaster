import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ clerkUserId: string }> }
) {
  try {
    const { clerkUserId } = await context.params;

    await connectDB(); 

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
