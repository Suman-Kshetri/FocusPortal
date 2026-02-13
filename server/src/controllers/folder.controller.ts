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

export const renameFolder = asyncHandler(async (req, res) => {
   const { folderId } = req.params;
   const { folderName } = req.body;

   if (!folderName || !folderName.trim()) {
      throw new ApiError(400, "Folder name is required");
   }

   const folder = await Folder.findOne({
      _id: new Types.ObjectId(folderId),
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

// for the move function we are using this function to trace the path with the folder:
// the lean function helps us to get the plain javascript object otherwise we get the mongoose objects

export const getAllFoldersWithPaths = asyncHandler(async (req, res) => {
   const currentUser = req.user;

   if (!currentUser) {
      throw new ApiError(403, "Unauthorized access");
   }

   const allFolders = await Folder.find({
      owner: currentUser._id,
   })
      .select("_id folderName parentFolder")
      .lean();

   const folderMap = new Map();
   allFolders.forEach((folder) => {
      folderMap.set(folder._id.toString(), folder);
   });

   const buildPath = (folder: any): { id: string; name: string }[] => {
      const path: { id: string; name: string }[] = [];
      let current = folder;
      const visited = new Set();

      while (current && !visited.has(current._id.toString())) {
         visited.add(current._id.toString());

         path.unshift({
            id: current._id.toString(),
            name: current.folderName,
         });

         if (current.parentFolder) {
            current = folderMap.get(current.parentFolder.toString());
         } else {
            current = null;
         }
      }

      return path;
   };

   const foldersWithPaths = allFolders.map((folder) => {
      const pathArray = buildPath(folder);
      return {
         id: folder._id.toString(),
         name: folder.folderName,
         parentFolder: folder.parentFolder?.toString() || null,
         path: pathArray.map((p) => p.name).join(" / "),
         pathArray,
      };
   });

   res.status(200).json(
      new ApiResponse(
         200,
         "All folders retrieved successfully",
         foldersWithPaths
      )
   );
});

// Helper function to check if a folder is a descendant of another
const isDescendantOf = async (
   folderId: Types.ObjectId,
   potentialAncestorId: Types.ObjectId
): Promise<boolean> => {
   // If trying to move into itself
   if (folderId.toString() === potentialAncestorId.toString()) {
      return true;
   }

   const folder = await Folder.findById(folderId);
   if (!folder || !folder.parentFolder) {
      return false;
   }

   // Recursively check parent chain
   return isDescendantOf(
      folder.parentFolder as Types.ObjectId,
      potentialAncestorId
   );
};

export const moveFolder = asyncHandler(async (req, res) => {
   const { folderId } = req.params;
   const { newParentId } = req.body;
   const currentUser = req.user;

   if (!currentUser) {
      throw new ApiError(403, "Unauthorized access");
   }

   // Validate folderId
   if (!Types.ObjectId.isValid(folderId)) {
      throw new ApiError(400, "Invalid folder ID format");
   }

   // Find the folder to move
   const folder = await Folder.findOne({
      _id: folderId,
      owner: currentUser._id,
   });

   if (!folder) {
      throw new ApiError(404, "Folder not found");
   }

   // If moving to a specific parent (not root)
   if (newParentId) {
      // Validate newParentId
      if (!Types.ObjectId.isValid(newParentId)) {
         throw new ApiError(400, "Invalid destination folder ID format");
      }

      // Check if destination folder exists and belongs to user
      const destinationFolder = await Folder.findOne({
         _id: newParentId,
         owner: currentUser._id,
      });

      if (!destinationFolder) {
         throw new ApiError(404, "Destination folder not found");
      }

      // Prevent moving folder into itself
      if (folderId === newParentId) {
         throw new ApiError(400, "Cannot move folder into itself");
      }

      // Prevent circular move (moving folder into its own descendant)
      const isCircular = await isDescendantOf(
         new Types.ObjectId(newParentId),
         new Types.ObjectId(folderId)
      );

      if (isCircular) {
         throw new ApiError(400, "Cannot move folder into its own subfolder");
      }

      // Check for duplicate folder name in destination
      const existingFolder = await Folder.findOne({
         folderName: folder.folderName,
         parentFolder: newParentId,
         owner: currentUser._id,
         _id: { $ne: folderId }, // Exclude current folder
      });

      if (existingFolder) {
         throw new ApiError(
            409,
            "A folder with the same name already exists in the destination"
         );
      }
   } else {
      // Moving to root - check for duplicates in root
      const existingFolder = await Folder.findOne({
         folderName: folder.folderName,
         parentFolder: null,
         owner: currentUser._id,
         _id: { $ne: folderId },
      });

      if (existingFolder) {
         throw new ApiError(
            409,
            "A folder with the same name already exists in root"
         );
      }
   }

   // Update the folder's parent
   folder.parentFolder = newParentId || null;
   await folder.save();

   res.status(200).json(
      new ApiResponse(200, "Folder moved successfully", folder)
   );
});
