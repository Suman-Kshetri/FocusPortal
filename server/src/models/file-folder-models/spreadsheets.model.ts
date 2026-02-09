import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema(
   {
      file: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "File",
         unique: true,
      },

      data: {
         type: Array, // 2D array
         default: [],
      },
   },
   { timestamps: true }
);

export const Sheet = mongoose.model("Sheet", sheetSchema);
