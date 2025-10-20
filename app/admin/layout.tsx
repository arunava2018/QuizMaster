import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  await connectDB();
  const admin = await AdminUser.findOne({ clerkUserId: userId });

  if (!admin) {
    redirect("/");
  }
  return <>{children}</>;
}
