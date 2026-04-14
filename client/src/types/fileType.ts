export type FileType = "pdf" | "docx" | "xlsx" | "md" | "image" | "txt";

export interface FileItem {
  _id: string;
  fileName: string;
  type: FileType;
  size?: number;
  path: string;
  editable?: boolean;
  cloudinaryPublicId?: string;
  folder?: string | null;
  createdAt: string;
  updatedAt: string;
}
