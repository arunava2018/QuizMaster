import mongoose, { Schema, model, models } from "mongoose";

const TopicSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Topic title is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    userAttempted : {
      type: Number,
      default:0,
    }
  },
  { timestamps: true }
);

export const Topic = models.Topic || model("Topic", TopicSchema);
