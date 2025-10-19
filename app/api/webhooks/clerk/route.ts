import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

interface ClerkWebhookEvent {
  type: string;
  data: any;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET in environment variables");
  }

  // Get the raw request body (text, not JSON)
  const payload = await req.text();

  // Extract svix headers (sent by Clerk)
  const headerList = await headers();
  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  // Verify signature using Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = evt;

  await connectDB();

  if (type === "user.created") {
    await User.create({
      clerkUserId: data.id,
      name: [data.first_name, data.last_name].filter(Boolean).join(" "),
      email: data.email_addresses.length > 0 ? data.email_addresses[0].email_address
        : "",
      avatar: data.image_url,
    });
  }

  if (type === "user.updated") {
    await User.findOneAndUpdate(
      { clerkUserId: data.id },
      {
        name: [data.first_name, data.last_name].filter(Boolean).join(" "),
        email: data.email_addresses.length > 0 ? data.email_addresses[0].email_address
          : "",
        avatar: data.image_url,
      }
    );
  }

  if (type === "user.deleted") {
    await User.deleteOne({ clerkUserId: data.id });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
