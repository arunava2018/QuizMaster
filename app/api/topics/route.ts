import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { Topic } from "@/models/Topics";
import { console } from "inspector";
// Add new topic — only admin can do this
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if user is admin
    const admin = await AdminUser.findOne({ clerkUserId: userId });
    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 403 }
      );
    }

    // Parse body
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    // Check if topic already exists
    const existingTopic = await Topic.findOne({ title });
    if (existingTopic) {
      return NextResponse.json(
        { message: "Topic with this title already exists." },
        { status: 409 }
      );
    }

    // Create new topic
    const newTopic = await Topic.create({ title, description});
    return NextResponse.json(
      { message: "Topic added successfully", topic: newTopic },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding topic:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fetch all topics (accessible to everyone)
export async function GET() {
  try {
    await connectDB();
    const topics = await Topic.find().sort({ createdAt: -1 });
    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
