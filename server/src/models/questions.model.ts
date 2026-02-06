import mongoose from "mongoose";

export type QuestionStatus = "open" | "closed" | "answered";

export interface QuestionSchemaTypes {
   title: string;
   content: string;
   author: mongoose.Types.ObjectId;
   category: string;
   tags: string[];
   images: string[];
   upvotes: mongoose.Types.ObjectId;
   downvotes: mongoose.Types.ObjectId;
   acceptedAnswer: mongoose.Schema.Types.ObjectId;
   status: QuestionStatus;
}

const questionSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      content: { type: String, required: true },
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      category: { type: String, required: true },
      tags: [{ type: String }],
      images: [{ type: String }],
      upvotedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    downvotedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
      acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
      status: {
         type: String,
         enum: ["open", "closed", "answered"],
         default: "open",
      },
   },
   { timestamps: true }
);

questionSchema.index({ title: "text", content: "text" });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ views: -1 });

export type QuestionDocument = mongoose.InferSchemaType<
   typeof questionSchema
> & {
   _id: mongoose.Types.ObjectId;
};

export const Question =
   mongoose.models.Question ||
   mongoose.model<QuestionDocument>("Question", questionSchema);
