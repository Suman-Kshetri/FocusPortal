import mongoose from "mongoose";

export interface CommentSchemaTypes {
  commentableType: "Question" | "Answer";
  commentableId: mongoose.Schema.Types.ObjectId;
  author: mongoose.Schema.Types.ObjectId;
  content: string;
}

const commentSchema = new mongoose.Schema(
  {
    commentableType: {
      type: String,
      enum: ["Question", "Answer"],
      required: true,
    },
    commentableId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "commentableType",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 500,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
commentSchema.index({ commentableType: 1, commentableId: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

export const Comment =
  mongoose.models.Comment ||
  mongoose.model<CommentSchemaTypes>("Comment", commentSchema);