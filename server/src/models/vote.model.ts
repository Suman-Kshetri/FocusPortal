import mongoose from "mongoose";

export interface VoteSchemaTypes {
   user: mongoose.Schema.Types.ObjectId;
   votableType: "Question" | "Comment";
   votableId: mongoose.Schema.Types.ObjectId;
   voteType: 1 | -1;
   voteCount: number;
}

const voteSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      votableType: {
         type: String,
         enum: ["Question", "Comment"],
         required: true,
      },
      votableId: { type: mongoose.Schema.Types.ObjectId, required: true },
      voteType: { type: Number, enum: [-1, 1], required: true },
      voteCount: {
         type: Number,
         default: 0,
      },
   },
   { timestamps: true }
);

voteSchema.index({ user: 1, votableType: 1, votableId: 1 }, { unique: true });

export const Vote =
   mongoose.models.Vote || mongoose.model<VoteSchemaTypes>("Vote", voteSchema);
