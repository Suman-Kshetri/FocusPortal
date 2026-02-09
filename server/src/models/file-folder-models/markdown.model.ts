import mongoose from "mongoose";

const markdownSchema = new mongoose.Schema(
   {
      file: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "File",
         unique: true,
      },

      content: {
         type: String,
         default: "",
      },
   },
   { timestamps: true }
);

export const Markdown = mongoose.model("Markdown", markdownSchema);
