import mongoose from "mongoose";

export interface CommentSchemaTypes {
  answer: mongoose.Schema.Types.ObjectId;
  author: mongoose.Schema.Types.ObjectId;
  content: string;
}

const commentSchema = new mongoose.Schema({
  answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxLength: 500 }
}, { timestamps: true });

commentSchema.index({ answer: 1, createdAt: 1 });

export const Comment = mongoose.models.Comment || mongoose.model<CommentSchemaTypes>('Comment', commentSchema);