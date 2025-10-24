import mongoose, { Schema, model, models } from "mongoose";

const TestInformationSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    questions: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        questionText: String,
        options: [String],
        correctAnswer: String,
      },
    ],

    responses: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedAnswer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const TestInformation =
  models.TestInformation || model("TestInformation", TestInformationSchema);
