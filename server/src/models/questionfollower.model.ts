import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface QuestionFollowerTypes {
   user: Types.ObjectId;
   question: Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const questionFollowerSchema = new Schema<QuestionFollowerTypes>(
   {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      question: {
         type: Schema.Types.ObjectId,
         ref: "Question",
         required: true,
      },
   },
   { timestamps: true }
);

questionFollowerSchema.index({ user: 1, question: 1 }, { unique: true });

const QuestionFollower: Model<QuestionFollowerTypes> =
   mongoose.models.QuestionFollower ||
   mongoose.model<QuestionFollowerTypes>(
      "QuestionFollower",
      questionFollowerSchema
   );
