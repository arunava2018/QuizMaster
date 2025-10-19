import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ isAdmin: false });
    }
    await connectDB();
    const admin = await AdminUser.findOne({ clerkUserId: userId });
    console.log(admin);
    return NextResponse.json({ isAdmin: !!admin });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
