import mongoose from "mongoose";

export interface VoteSchemaTypes {
    user: mongoose.Schema.Types.ObjectId;
    votableType: "Question" | "Answer";
    votableId: mongoose.Schema.Types.ObjectId;
    voteType: 1 | -1;
}

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votableType: { type: String, enum: ['Question', 'Answer'], required: true },
  votableId: { type: mongoose.Schema.Types.ObjectId, required: true },
  voteType: { type: Number, enum: [-1, 1], required: true }
}, { timestamps: true });

voteSchema.index({ user: 1, votableType: 1, votableId: 1 }, { unique: true });

export const Vote = mongoose.models.Vote || mongoose.model<VoteSchemaTypes>('Vote', voteSchema);