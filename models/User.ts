import mongoose, { Schema, model, models } from "mongoose";

const TopicTestInfoSchema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    scores: [
      {
        score: {
          type: Number,
          required: true,
        },
        attemptedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    avatar: { type: String },
    testInfo: [TopicTestInfoSchema],
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
