import mongoose from "mongoose";

export interface AnswerSchemaTypes {
   question: mongoose.Schema.Types.ObjectId;
   content: string;
   author: mongoose.Schema.Types.ObjectId;
   isAccepted: boolean;
   upvotes: number;
   downvotes: number;
}

const answerSchema = new mongoose.Schema(
   {
      question: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Question",
         required: true,
      },
      content: { type: String, required: true },
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      isAccepted: { type: Boolean, default: false },
      upvotedBy: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      downvotedBy: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
   },
   { timestamps: true }
);

answerSchema.index({ question: 1, createdAt: 1 });
answerSchema.index({ question: 1, isAccepted: 1 });
answerSchema.index({ question: 1, upvotes: -1 });

export const Answer =
   mongoose.models.Answer || mongoose.model("Answer", answerSchema);
