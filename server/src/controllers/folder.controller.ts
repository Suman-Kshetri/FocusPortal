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
   const { folderId } = req.params;

   // Handle root folder case
   if (folderId === "root" || !folderId) {
      const rootFolders = await Folder.find({
         parentFolder: null,
         owner: req.user._id,
      }).select("+parentFolder"); // Explicitly select parentFolder

      const rootFiles = await File.find({
         folder: null,
         owner: req.user._id,
      });

      return res.status(200).json(
         new ApiResponse(200, "Root content fetched successfully", {
            folder: null,
            subFolders: rootFolders,
            files: rootFiles,
         })
      );
   }

   // Handle specific folder case
   const folder = await Folder.findOne({
      _id: folderId,
      owner: req.user._id,
   }).select("+parentFolder");

   if (!folder) {
      throw new ApiError(404, "Folder not found");
   }

   const subFolders = await Folder.find({
      parentFolder: folderId,
      owner: req.user._id,
   }).select("+parentFolder");

   const files = await File.find({
      folder: folderId,
      owner: req.user._id,
   });

   res.status(200).json(
      new ApiResponse(200, "Folder content fetched successfully", {
         folder,
         subFolders,
         files,
      })
   );
});

//root folder
export const getRootFolders = asyncHandler(async (req, res) => {
   const rootFolders = await Folder.find({
      parentFolder: null,
      owner: req.user._id,
   });

   const rootFiles = await File.find({
      folder: null,
      owner: req.user._id,
   });

   res.status(200).json(
      new ApiResponse(200, "Root content fetched successfully", {
         folder: null,
         subFolders: rootFolders,
         files: rootFiles,
      })
   );
});

export const moveFolder = asyncHandler(async (req, res) => {
   const { folderId } = req.params;
   const { newParentId } = req.body;
   const folder = await Folder.findOne({ _id: folderId, owner: req.user._id });
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
   const { folderId } = req.params;
   const { folderName } = req.body;

   if (!folderName || !folderName.trim()) {
      throw new ApiError(400, "Folder name is required");
   }

   const folder = await Folder.findOne({
      _id: folderId,
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
   const { folderId } = req.params;

   const folder = await Folder.findOne({
      _id: folderId,
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

export const getFolderPath = asyncHandler(async (req, res) => {
   const { folderId } = req.params;
   const currentUser = req.user;

   if (!currentUser) {
      throw new ApiError(403, "Unauthorized access");
   }

   if (!folderId) {
      throw new ApiError(400, "Folder ID is required");
   }

   if (!Types.ObjectId.isValid(folderId)) {
      throw new ApiError(400, "Invalid folder ID format");
   }

   const folder = await Folder.findById(folderId);

   if (!folder) {
      throw new ApiError(404, "Folder not found");
   }

   if (folder.owner.toString() !== currentUser._id.toString()) {
      throw new ApiError(403, "Not authorized to access this folder");
   }

   const path: { id: string; name: string }[] = [];
   let currentFolder: typeof folder | null = folder;

   while (currentFolder) {
      path.unshift({
         id: currentFolder._id.toString(),
         name: currentFolder.folderName,
      });

      if (currentFolder.parentFolder) {
         currentFolder = await Folder.findById(currentFolder.parentFolder);
      } else {
         currentFolder = null;
      }
   }

   res.status(200).json(
      new ApiResponse(200, "Folder path retrieved successfully", path)
   );
});
