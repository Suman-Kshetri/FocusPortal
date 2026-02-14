import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { docsUpload } from "../middlewares/docsUpload.middleware.js";
import {
   uploadFile,
   createFile,
   editFile,
   listFiles,
   getFile,
   readFileContent,
   moveFile,
   renameFile,
   deleteFile,
   downloadFile,
} from "../controllers/files.controller.js";

const filesRoute = express.Router();
filesRoute.use(verifyJwt);
filesRoute.post("/upload", docsUpload.array("files", 10), uploadFile);
filesRoute.post("/create", createFile);
filesRoute.get("/folder/:folderId", listFiles);
filesRoute.get("/:fileId", getFile);
filesRoute.get("/:fileId/content", readFileContent);
filesRoute.get("/:fileId/download", downloadFile);
filesRoute.put("/:fileId/edit", editFile);
filesRoute.put("/:fileId/move", moveFile);
filesRoute.patch("/:fileId/rename", renameFile);
filesRoute.delete("/:fileId/delete", deleteFile);

export default filesRoute;
