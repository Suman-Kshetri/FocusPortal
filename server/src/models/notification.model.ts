import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      type: {
         type: String,
         enum: ["answers", "comments", "followers", "system"],
         required: true,
      },
      message: { type: String, required: true },
      read: { type: Boolean, default: false },
      relatedId: { type: mongoose.Schema.Types.ObjectId },
   },
   { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
