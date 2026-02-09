import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },

      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },

      parentFolder: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Folder",
         default: null, // root
      },
   },
   { timestamps: true }
);

export const Folder = mongoose.model("Folder", folderSchema);
