import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { Topic } from "@/models/Topics";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    await connectDB();

    // Verify admin access
    const admin = await AdminUser.findOne({ clerkUserId: userId });
    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Invalid topic ID" },
        { status: 400 }
      );
    }

    // Delete topic
    const deletedTopic = await Topic.findByIdAndDelete(id);

    if (!deletedTopic) {
      return NextResponse.json(
        { message: "Topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Topic deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
