import "dotenv/config";
import { connectDB } from "@/lib/db";
import { Topic } from "@/models/Topics";

async function updateTopics() {
  await connectDB();

  const result = await Topic.updateMany(
    { userAttempted: { $exists: false } }, 
    { $set: { userAttempted: 0 } }        
  );

  console.log(`✅ Updated ${result.modifiedCount} topics with userAttempted = 0`);
  process.exit();
}

updateTopics();
