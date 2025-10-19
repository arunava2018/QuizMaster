import { Schema, model, models } from "mongoose";
const AdminUserSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true, 
    },
  },
  { timestamps: true }
);

export const AdminUser =
  models.AdminUser || model("AdminUser", AdminUserSchema);
