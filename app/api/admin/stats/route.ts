import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { AdminUser } from "@/models/AdminUser";
import { Topic } from "@/models/Topics";

export async function GET() {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalAdmins = await AdminUser.countDocuments();
    const totalTopics = await Topic.countDocuments();

    return NextResponse.json({
      totalUsers,
      totalAdmins,
      totalTopics,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
