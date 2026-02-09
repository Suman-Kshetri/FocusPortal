import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
   {
      fileName: { type: String, required: true },

      type: {
         type: String,
         enum: ["pdf", "docx", "xlsx", "md", "image"],
         required: true,
      },

      source: {
         type: String,
         enum: ["upload", "created"],
         required: true,
      },

      path: {
         type: String,
         required: true,
      },

      size: {
         type: Number,
         default: 0,
      },
      mimeType: {
         type: String,
         default: "",
      },

      folder: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Folder",
         default: null,
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
      cloudinaryPublicId: { type: String, default: null },
   },
   { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);
