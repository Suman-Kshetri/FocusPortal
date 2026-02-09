import mongoose from "mongoose";

const pdfAnnotationSchema = new mongoose.Schema(
   {
      file: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "File",
         required: true,
      },

      page: Number,
      type: String, // highlight | note | draw
      position: Object,
      content: String,

      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   },
   { timestamps: true }
);
