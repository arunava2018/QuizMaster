import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { Topic } from "@/models/Topics";

// ==============================
// DELETE: Remove a topic by ID
// ==============================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();

    // Verify admin access
    const admin = await AdminUser.findOne({ clerkUserId: userId });
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ message: "Invalid topic ID" }, { status: 400 });
    }

    // Delete topic
    const deletedTopic = await Topic.findByIdAndDelete(id);
    if (!deletedTopic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Topic deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ==========================================
// GET: Fetch topic details by ID
// ==========================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Invalid topic ID" }, { status: 400 });
    }

    await connectDB();
    const topic = await Topic.findById(id).lean();

    if (!topic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ topic }, { status: 200 });
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
