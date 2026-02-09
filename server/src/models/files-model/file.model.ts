import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },

      type: {
         type: String,
         enum: ["pdf", "docx", "xlsx", "md", "image"],
         required: true,
      },

      source: {
         type: String,
         enum: ["upload", "generated"],
         required: true,
      },

      path: {
         type: String,
         required: true,
      },

      size: Number,
      mimeType: String,

      folder: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Folder",
         required: true,
      },

      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },

      editable: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);
