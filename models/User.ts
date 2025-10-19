import { Schema, model, models } from "mongoose";
const UserSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
