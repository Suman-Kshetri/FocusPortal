import { Upload, X, ImageIcon, FileWarning } from "lucide-react";
import { useState, useRef } from "react";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  maxImages = 2,
  maxSizeMB = 2,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = selectedFiles.length + newFiles.length;

    if (totalFiles > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        setError(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`${file.name} exceeds ${maxSizeMB}MB`);
        continue;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...validFiles];
      const updatedPreviews = [...previews, ...newPreviews];

      setSelectedFiles(updatedFiles);
      setPreviews(updatedPreviews);
      onImagesChange(updatedFiles);
      setError("");
    }
  };

  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onImagesChange(newFiles);
    setError("");
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-base
          ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:shadow-glow"
          }
          ${selectedFiles.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={selectedFiles.length >= maxImages}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`
              w-14 h-14 rounded-full flex items-center justify-center
              transition-all duration-base
              ${
                isDragging
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-muted-foreground"
              }
            `}
          >
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <p className="font-medium text-foreground">
              {isDragging ? "Drop images here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PNG, JPG, GIF up to {maxSizeMB}MB ({selectedFiles.length}/{maxImages})
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg text-sm
          bg-destructive/10 border border-destructive/20 text-destructive">
          <FileWarning className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden
                border border-border bg-accent/50"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-base group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-base">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full
                    bg-destructive text-destructive-foreground
                    flex items-center justify-center opacity-0 group-hover:opacity-100
                    transition-all duration-base hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-2
                  bg-gradient-to-t from-black/80 to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-base">
                  <p className="text-white text-xs truncate">
                    {selectedFiles[index]?.name}
                  </p>
                  <p className="text-white/70 text-xs">
                    {(selectedFiles[index]?.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previews.length === 0 && (
        <div className="text-center py-4">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};
