import express from "express";
import {
   createFolder,
   deleteFolder,
   getFolderContents,
   moveFolder,
   renameFolder,
} from "../controllers/folder.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const folderRoute = express.Router();

folderRoute.post("/create", verifyJwt, createFolder);
folderRoute.get("/:id", verifyJwt, getFolderContents);
folderRoute.patch("/:id/edit", verifyJwt, renameFolder);
folderRoute.put("/:id/move", moveFolder);
folderRoute.delete("/:id/delete", verifyJwt, deleteFolder);

export default folderRoute;
