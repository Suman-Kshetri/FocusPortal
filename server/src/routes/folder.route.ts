import express from "express";
import {
   createFolder,
   deleteFolder,
   getAllFoldersWithPaths,
   getFolderContents,
   getFolderPath,
   getRootFolders,
   moveFolder,
   renameFolder,
} from "../controllers/folder.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const folderRoute = express.Router();

folderRoute.post("/create", verifyJwt, createFolder);
folderRoute.get("/:folderId", verifyJwt, getFolderContents);
folderRoute.get("/all/with-paths", verifyJwt, getAllFoldersWithPaths);
folderRoute.patch("/:folderId/edit", verifyJwt, renameFolder);
folderRoute.put("/:folderId/move", verifyJwt, moveFolder);
folderRoute.delete("/:folderId/delete", verifyJwt, deleteFolder);
folderRoute.get("/root", verifyJwt, getRootFolders);
folderRoute.get("/:folderId/path", verifyJwt, getFolderPath);
export default folderRoute;
