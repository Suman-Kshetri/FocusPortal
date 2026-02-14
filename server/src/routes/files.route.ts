// routes/files.route.ts
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

// File upload and creation
filesRoute.post("/upload", docsUpload.array("files", 10), uploadFile);
filesRoute.post("/create", createFile);

// File listing
filesRoute.get("/folder/:folderId/files", listFiles);

// File operations
filesRoute.get("/:id", getFile);
filesRoute.get("/:id/content", readFileContent);
filesRoute.get("/:id/download", downloadFile);
filesRoute.patch("/:id/edit", editFile);
filesRoute.patch("/:id/move", moveFile);
filesRoute.patch("/:id/rename", renameFile);
filesRoute.delete("/delete/:id", deleteFile);

export default filesRoute;
