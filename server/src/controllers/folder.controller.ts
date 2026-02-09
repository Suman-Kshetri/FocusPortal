import { Folder } from "../models/file-folder-models/folder.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { File } from "../models/file-folder-models/file.model.js";
import { Types } from "mongoose";

export const createFolder = asyncHandler(async (req, res) => {
   const { folderName, parentFolder } = req.body;
   const currentUser = req.user;

   if (!currentUser) {
      throw new ApiError(403, "Unauthorized access");
   }

   if (!folderName || !folderName.trim()) {
      throw new ApiError(400, "Folder name should be specified");
   }

   const normalizedName = folderName.trim();

   // Prevent same-name folder in same parent
   const existingFolder = await Folder.findOne({
      folderName: normalizedName,
      parentFolder: parentFolder || null,
      owner: currentUser._id,
   });

   if (existingFolder) {
      throw new ApiError(
         409,
         "A folder with the same name already exists in this location"
      );
   }

   const folder = await Folder.create({
      folderName: normalizedName,
      parentFolder: parentFolder || null,
      owner: currentUser._id,
   });

   res.status(201).json(
      new ApiResponse(201, "Folder created successfully", folder)
   );
});

export const getFolderContents = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const folder = await Folder.findOne({ _id: id, owner: req.user._id });
   if (!folder) {
      throw new ApiError(404, "Folder not found");
   }
   const subFolders = await Folder.find({
      parentFolder: id,
      owner: req.user.id,
   });
   const files = await File.find({ folder: id, owner: req.user._id });
   res.status(200).json(
      new ApiResponse(200, "Folder content fetched successfully", {
         folder,
         subFolders,
         files,
      })
   );
});

export const moveFolder = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { newParentId } = req.body;
   const folder = await Folder.findOne({ _id: id, owner: req.user._id });
   if (!folder) {
      throw new ApiError(404, "Folder not found");
   }
   folder.parentFolder = newParentId || null;
   await folder.save();
   res.status(200).json(
      new ApiResponse(200, "Folder moved successfully", folder)
   );
});

export const renameFolder = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { folderName } = req.body;

   if (!folderName || !folderName.trim()) {
      throw new ApiError(400, "Folder name is required");
   }

   const folder = await Folder.findOne({
      _id: id,
      owner: req.user._id,
   });

   if (!folder) {
      throw new ApiError(404, "Folder not found");
   }

   folder.folderName = folderName.trim();
   await folder.save();

   res.status(200).json(
      new ApiResponse(200, "Folder renamed successfully", folder)
   );
});

const deleteFolderRecursively = async (
   folderId: Types.ObjectId,
   userId: Types.ObjectId
) => {
   const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
   });

   if (!folder) return;

   const files = await File.find({ folder: folder._id });
   const fs = await import("fs/promises");

   for (const file of files) {
      await fs.unlink(file.path).catch(() => {});
      await file.deleteOne();
   }

   const subfolders = await Folder.find({ parentFolder: folder._id });

   for (const sub of subfolders) {
      await deleteFolderRecursively(sub._id, userId);
   }

   await folder.deleteOne();
};

export const deleteFolder = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const folder = await Folder.findOne({
      _id: id,
      owner: req.user._id,
   });

   if (!folder) {
      throw new ApiError(404, "Folder not found");
   }

   await deleteFolderRecursively(folder._id, req.user._id);

   res.status(200).json(
      new ApiResponse(200, "Folder and all contents deleted successfully", {})
   );
});
