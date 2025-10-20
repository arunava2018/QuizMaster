import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const admins = await AdminUser.find({}, "clerkUserId");
    const adminIds = admins.map((admin) => admin.clerkUserId);

    if (adminIds.length === 0) {
      return NextResponse.json({ admins: [] });
    }

    const adminDetails = await User.find(
      { clerkUserId: { $in: adminIds } },
      "name email"
    );

    return NextResponse.json({ admins: adminDetails });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    return NextResponse.json(
      { admins: [], message: "Internal server error" },
      { status: 500 }
    );
  }
}
