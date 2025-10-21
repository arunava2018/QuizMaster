import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    questionText: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, "Options are required"],
      validate: {
        validator: (v: string[]) => v.length >= 2,
        message: "At least two options are required",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    explanation : {
      type: String,
      required: [true, "Explanation is required"],
    }
  },
  { timestamps: true }
);

export const Question = models.Question || model("Question", QuestionSchema);
