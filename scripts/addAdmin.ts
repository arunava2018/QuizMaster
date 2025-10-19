import "dotenv/config";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";

async function addAdmin() {
  await connectDB();

  const clerkUserId = "user_34I60AQDrDiO2yUabBA6e78vM8A";

  const exists = await AdminUser.findOne({ clerkUserId });
  if (exists) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  await AdminUser.create({ clerkUserId });
  console.log("Admin added successfully:", clerkUserId);

  process.exit(0);
}

addAdmin();
