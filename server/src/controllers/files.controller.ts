import { Folder } from "../models/file-folder-models/folder.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { File } from "../models/file-folder-models/file.model.js";
import { unlink, mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getFileType = (mimetype: string) => {
   if (mimetype.includes("pdf")) return "pdf";
   if (mimetype.includes("word") || mimetype.includes("document"))
      return "docx";
   if (mimetype.includes("sheet") || mimetype.includes("excel")) return "xlsx";
   if (mimetype.includes("markdown")) return "md";
   if (mimetype.includes("image")) return "image";
   if (mimetype.includes("txt")) return "txt";
   return "other";
};

export const uploadFile = asyncHandler(async (req, res) => {
   const { folder } = req.body;
   const files = req.files
      ? (req.files as Express.Multer.File[])
      : req.file
        ? [req.file]
        : [];

   if (files.length === 0) {
      throw new ApiError(400, "No files uploaded");
   }

   if (folder) {
      const folderExists = await Folder.findOne({
         _id: folder,
         owner: req.user._id,
      });
      if (!folderExists) {
         for (const file of files) {
            await unlink(file.path).catch(() => {});
         }
         throw new ApiError(404, "Folder not found");
      }
   }

   const uploadedFiles = [];
   const errors = [];

   for (const uploadedFile of files) {
      try {
         const fileType = getFileType(uploadedFile.mimetype);
         let filePath = uploadedFile.path;
         let cloudinaryPublicId = null;

         if (fileType === "image") {
            try {
               const cloudinaryResult = await uploadOnCloudinary(
                  uploadedFile.path
               );
               if (!cloudinaryResult || !cloudinaryResult.url) {
                  throw new Error("Cloudinary upload failed");
               }
               filePath = cloudinaryResult.url;
               cloudinaryPublicId = cloudinaryResult.public_id;
               await unlink(uploadedFile.path).catch(() => {});
            } catch (error) {
               await unlink(uploadedFile.path).catch(() => {});
               errors.push({
                  fileName: uploadedFile.originalname,
                  error: "Failed to upload to Cloudinary",
               });
               continue;
            }
         }

         const file = await File.create({
            fileName: uploadedFile.originalname,
            type: fileType,
            source: "upload",
            path: filePath,
            size: uploadedFile.size,
            mimeType: uploadedFile.mimetype,
            folder: folder || null,
            owner: req.user._id,
            editable: fileType === "md" || fileType === "xlsx",
            cloudinaryPublicId,
         });

         uploadedFiles.push(file);
      } catch (error) {
         errors.push({
            fileName: uploadedFile.originalname,
            error: error instanceof Error ? error.message : "Upload failed",
         });
      }
   }
   const status = uploadedFiles.length > 0 ? 201 : 400;
   const message =
      uploadedFiles.length === files.length
         ? "All files uploaded successfully"
         : uploadedFiles.length > 0
           ? "Some files uploaded successfully"
           : "All uploads failed";

   res.status(status).json(
      new ApiResponse(status, message, {
         success: uploadedFiles.length,
         failed: errors.length,
         files: uploadedFiles,
         errors: errors.length > 0 ? errors : undefined,
      })
   );
});

export const createFile = asyncHandler(async (req, res) => {
   const { fileName, type, content, folder } = req.body;

   if (!fileName || !type) {
      throw new ApiError(400, "File name and type are required");
   }
   if (type !== "md" && type !== "xlsx") {
      throw new ApiError(400, "Can only create md or xlsx files");
   }

   if (folder) {
      const folderExists = await Folder.findOne({
         _id: folder,
         owner: req.user._id,
      });
      if (!folderExists) {
         throw new ApiError(404, "Folder not found");
      }
   }
   const extension = type === "md" ? "md" : "xlsx";
   const timestamp = Date.now();
   const uniqueFileName = `${timestamp}-${fileName}.${extension}`;
   const docsDir = path.join(process.cwd(), "public", "temp", "docs");
   const filePath = path.join(docsDir, uniqueFileName);

   await mkdir(docsDir, { recursive: true });

   await writeFile(filePath, content || "", "utf-8");

   const fileSize = Buffer.byteLength(content || "", "utf-8");

   const file = await File.create({
      fileName: `${fileName}.${extension}`,
      type,
      source: "created",
      path: filePath,
      size: fileSize,
      mimeType:
         type === "md"
            ? "text/markdown"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      folder: folder || null,
      owner: req.user._id,
      editable: true,
   });

   res.status(201).json(
      new ApiResponse(201, "File created successfully", file)
   );
});

export const editFile = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { content } = req.body;

   if (content === undefined || content === null) {
      throw new ApiError(400, "Content is required");
   }

   const file = await File.findOne({
      _id: id,
      owner: req.user._id,
   });

   if (!file) {
      throw new ApiError(404, "File not found");
   }

   if (!file.editable) {
      throw new ApiError(403, "This file type is not editable");
   }

   await writeFile(file.path, content, "utf-8");

   file.size = Buffer.byteLength(content, "utf-8");
   await file.save();

   res.status(200).json(
      new ApiResponse(200, "File updated successfully", file)
   );
});

export const listFiles = asyncHandler(async (req, res) => {
   const { folderId } = req.params;

   const folderQuery = folderId === "root" ? null : folderId;
   if (folderId !== "root") {
      const folderExists = await Folder.findOne({
         _id: folderId,
         owner: req.user._id,
      });
      if (!folderExists) {
         throw new ApiError(404, "Folder not found");
      }
   }

   const files = await File.find({
      folder: folderQuery,
      owner: req.user._id,
   })
      .populate("folder", "folderName")
      .sort({ createdAt: -1 });

   res.status(200).json(
      new ApiResponse(200, "Files fetched successfully", {
         count: files.length,
         files,
      })
   );
});

export const getFile = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const file = await File.findOne({
      _id: id,
      owner: req.user._id,
   }).populate("folder", "folderName");

   if (!file) {
      throw new ApiError(404, "File not found");
   }

   res.status(200).json(
      new ApiResponse(200, "File fetched successfully", file)
   );
});

export const readFileContent = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const file = await File.findOne({
      _id: id,
      owner: req.user._id,
   });

   if (!file) {
      throw new ApiError(404, "File not found");
   }

   if (!file.editable) {
      throw new ApiError(
         403,
         "Cannot read content of this file type. Only md and xlsx files are readable."
      );
   }

   try {
      const content = await readFile(file.path, "utf-8");

      res.status(200).json(
         new ApiResponse(200, "File content fetched successfully", {
            file: {
               id: file._id,
               fileName: file.fileName,
               type: file.type,
               size: file.size,
               editable: file.editable,
            },
            content,
         })
      );
   } catch (error) {
      throw new ApiError(500, "Failed to read file content");
   }
});

export const moveFile = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { folderId } = req.body;

   const file = await File.findOne({
      _id: id,
      owner: req.user._id,
   });

   if (!file) {
      throw new ApiError(404, "File not found");
   }

   if (folderId && folderId !== "root") {
      const folderExists = await Folder.findOne({
         _id: folderId,
         owner: req.user._id,
      });
      if (!folderExists) {
         throw new ApiError(404, "Target folder not found");
      }
   }

   file.folder = folderId === "root" || !folderId ? null : folderId;
   await file.save();

   const updatedFile = await File.findById(file._id).populate(
      "folder",
      "folderName"
   );

   res.status(200).json(
      new ApiResponse(200, "File moved successfully", updatedFile)
   );
});

export const renameFile = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { fileName } = req.body;

   if (!fileName || !fileName.trim()) {
      throw new ApiError(400, "File name is required");
   }

   const file = await File.findOne({
      _id: id,
      owner: req.user._id,
   });

   if (!file) {
      throw new ApiError(404, "File not found");
   }

   const oldExt = path.extname(file.fileName);
   const newName = fileName.trim();
   const finalName = newName.endsWith(oldExt) ? newName : `${newName}${oldExt}`;

   file.fileName = finalName;
   await file.save();

   res.status(200).json(
      new ApiResponse(200, "File renamed successfully", file)
   );
});

import { deleteFromCloudinary } from "../utils/cloudinary.js";

export const deleteFile = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const file = await File.findOne({
      _id: id,
      owner: req.user._id,
   });

   if (!file) {
      throw new ApiError(404, "File not found");
   }

   if (file.cloudinaryPublicId) {
      try {
         await deleteFromCloudinary(file.cloudinaryPublicId);
         console.log("Image deleted from Cloudinary");
      } catch (error) {
         console.error("Failed to delete from Cloudinary:", error);
      }
   } else {
      try {
         await unlink(file.path);
         console.log("File deleted from local storage");
      } catch (error) {
         console.log(
            "File not found on disk, proceeding with database deletion"
         );
      }
   }

   await file.deleteOne();

   res.status(200).json(new ApiResponse(200, "File deleted successfully", {}));
});

export const downloadFile = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const file = await File.findOne({
      _id: id,
      owner: req.user._id,
   });

   if (!file) {
      throw new ApiError(404, "File not found");
   }

   try {
      // If file is stored on Cloudinary (images), redirect to Cloudinary URL
      if (file.cloudinaryPublicId && file.type === "image") {
         // For Cloudinary images, just send the URL back
         return res.status(200).json(
            new ApiResponse(200, "File URL retrieved", {
               url: file.path,
               fileName: file.fileName,
               type: "cloudinary",
            })
         );
      }

      // For local files (PDFs, DOCX, etc.)
      // Check if file exists
      const fs = await import("fs/promises");
      try {
         await fs.access(file.path);
      } catch (error) {
         throw new ApiError(404, "File not found on server");
      }

      res.setHeader(
         "Content-Type",
         file.mimeType || "application/octet-stream"
      );
      res.setHeader(
         "Content-Disposition",
         `attachment; filename="${file.fileName}"`
      );

      const fileBuffer = await readFile(file.path);
      res.send(fileBuffer);
   } catch (error) {
      console.error("Download error:", error);
      throw new ApiError(500, `Failed to download file`);
   }
});
