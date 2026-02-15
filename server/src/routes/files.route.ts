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
   viewFile,
} from "../controllers/files.controller.js";

const filesRoute = express.Router();

filesRoute.use(verifyJwt);

filesRoute.post("/upload", docsUpload.array("files", 10), uploadFile);
filesRoute.post("/create", createFile);

filesRoute.get("/folder/:folderId/files", listFiles);
filesRoute.get("/:id", getFile);
filesRoute.get("/:id/content", readFileContent);
filesRoute.get("/:id/download", downloadFile);
filesRoute.patch("/:id/edit", editFile);
filesRoute.patch("/:id/move", moveFile);
filesRoute.patch("/:id/rename", renameFile);
filesRoute.delete("/delete/:id", deleteFile);
filesRoute.get("/:id/view", viewFile);

export default filesRoute;
