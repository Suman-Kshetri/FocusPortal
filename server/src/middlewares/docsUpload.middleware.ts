import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";
import type { FileFilterCallback } from "multer";

const docsDir = path.join(process.cwd(), "public", "temp", "docs");

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, docsDir);
   },
   filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
   },
});

interface MulterFile {
    mimetype: string;
}

const fileFilter = (
    req: Request,
    file: MulterFile,
    cb: FileFilterCallback
): void => {
    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
        "text/markdown",
        "image/png",
        "image/jpeg",
        "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Invalid file type: ${file.mimetype}`));
};

export const docsUpload = multer({
   storage,
   fileFilter,
   limits: { fileSize: 10 * 1024 * 1024 },
});
