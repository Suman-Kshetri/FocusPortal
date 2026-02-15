import { useState, useRef } from "react";
import { Upload, X, File, AlertCircle } from "lucide-react";
import { useFileUpload } from "@/server/api/files/useFileUpload";

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId: string | null;
  onUploadSuccess?: () => void;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  md: "text/markdown",
  txt: "text/plain",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

interface SelectedFile {
  file: File;
  preview?: string;
  type: "pdf" | "docx" | "xlsx" | "md" | "image" | "webp" | "gif";
  error?: string;
}

export const FileUploadDialog = ({
  isOpen,
  onClose,
  currentFolderId,
  onUploadSuccess,
}: FileUploadDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onSubmit, isLoading } = useFileUpload();

  if (!isOpen) return null;

  const getFileType = (
    file: File,
  ): "pdf" | "docx" | "xlsx" | "md" | "image" | "webp" | "gif" => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png"].includes(extension || "")) {
      return "image";
    }
    if (extension === "webp") {
      return "webp";
    }
    if (extension === "gif") {
      return "gif";
    }
    return extension as "pdf" | "docx" | "xlsx" | "md";
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`;
    }
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !Object.keys(ALLOWED_TYPES).includes(extension)) {
      return "File type not supported";
    }
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (selectedFiles.length + fileArray.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files at once`);
      return;
    }

    const newFiles: SelectedFile[] = fileArray.map((file) => {
      const error = validateFile(file);
      const type = getFileType(file);

      let preview: string | undefined;
      if (type === "image") {
        preview = URL.createObjectURL(file);
      }

      return {
        file,
        preview,
        type,
        error: error || undefined,
      };
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview!);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleUpload = async () => {
    const validFiles = selectedFiles.filter((sf) => !sf.error);
    if (validFiles.length === 0) {
      alert("No valid files to upload");
      return;
    }

    try {
      const formData = new FormData();

      validFiles.forEach((sf) => {
        formData.append("files", sf.file);
      });
      if (currentFolderId) {
        formData.append("folder", currentFolderId);
      }
      await onSubmit(formData);
      // console.log($&)
      selectedFiles.forEach((sf) => {
        if (sf.preview) {
          URL.revokeObjectURL(sf.preview);
        }
      });

      setSelectedFiles([]);
      onUploadSuccess?.();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleClose = () => {
    // Clean up previews
    selectedFiles.forEach((sf) => {
      if (sf.preview) {
        URL.revokeObjectURL(sf.preview);
      }
    });
    setSelectedFiles([]);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Upload Files</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add files to{" "}
              {currentFolderId ? "this folder" : "your root directory"}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Upload Guidelines:
                </p>
                <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• Maximum {MAX_FILES} files per upload</li>
                  <li>
                    • Maximum file size: {formatFileSize(MAX_FILE_SIZE)} per
                    file
                  </li>
                  <li>
                    • Supported formats: PDF, DOCX, XLSX, MD, JPG, PNG, WEBP,
                    GIF
                  </li>
                  <li>
                    • Images will show preview, documents will show name only
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          {selectedFiles.length === 0 && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-12
                flex flex-col items-center justify-center
                cursor-pointer transition-all duration-300
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-border hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
                }
              `}
            >
              <Upload className="w-16 h-16 text-blue-500 mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Select up to {MAX_FILES} files
              </p>
            </div>
          )}

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Selected Files ({selectedFiles.length}/{MAX_FILES})
                </h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                >
                  Add more files
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {selectedFiles.map((selectedFile, index) => (
                  <div
                    key={index}
                    className={`
                      border rounded-lg p-3 flex items-center gap-3
                      ${
                        selectedFile.error
                          ? "border-red-300 bg-red-50 dark:bg-red-950/20"
                          : "border-border bg-card"
                      }
                    `}
                  >
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      {selectedFile.type === "image" && selectedFile.preview ? (
                        <img
                          src={selectedFile.preview}
                          alt={selectedFile.file.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <File className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {selectedFile.file.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(selectedFile.file.size)}</span>
                        <span>•</span>
                        <span className="uppercase">{selectedFile.type}</span>
                      </div>
                      {selectedFile.error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {selectedFile.error}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                      className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".docx,.jpg,.jpeg,.png,.pdf,.md,.xlsx,.txt"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={isLoading}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-accent/50 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedFiles.filter((sf) => !sf.error).length} valid file(s) ready
            to upload
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={
                selectedFiles.length === 0 ||
                isLoading ||
                selectedFiles.every((sf) => sf.error)
              }
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Files
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
