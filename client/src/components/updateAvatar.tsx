import { useRef, useState, useEffect } from "react";
import { Edit2, X, Check, Image, Upload } from "lucide-react";
import { useUploadAvatar } from "@/server/api/users/useUploadAvatar";

interface AvatarUploadProps {
  src: string;
  alt: string;
}

export const AvatarUpload = ({ src, alt }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string>(src);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [showPreviewCard, setShowPreviewCard] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onUpload } = useUploadAvatar();

  useEffect(() => {
    setPreview(src);
  }, [src]);

  const handleIconClick = () => {
    setShowMenu((prev) => !prev);
  };

  const handleUploadClick = () => {
    setShowMenu(false);
    fileInputRef.current?.click();
  };

  const handleViewClick = () => {
    setShowMenu(false);
    setPreview(src);
    setShowPreviewCard(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setShowPreviewCard(true);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    onUpload(formData);

    setShowPreviewCard(false);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    setPreview(src);
    setSelectedFile(null);
    setShowPreviewCard(false);
  };

  return (
    <div className="absolute">
      <img
        src={preview}
        alt={alt}
        className="w-31 h-31 flex rounded-full border-4 border-card shadow-xl bg-card object-cover"
      />

      <button
        type="button"
        onClick={handleIconClick}
        className="absolute bottom-0 right-0 p-2 rounded-full bg-background border shadow-md hover:bg-background/80 transition z-20 cursor-pointer"
      >
        <Edit2 className="w-5 h-5 " />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-36 w-48 bg-background border rounded-lg shadow-lg z-30 overflow-hidden">
          <button
            onClick={handleUploadClick}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload new profile
          </button>

          <button
            onClick={handleViewClick}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition cursor-pointer"
          >
            <Image className="w-4 h-4" />
            View profile photo
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {showPreviewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 "
        onClick={() => setShowPreviewCard(!showPreviewCard)}
        >
          <div className="bg-popover rounded-xl shadow-lg border p-6 w-96 relative">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Profile Preview
            </h3>

            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-[70vh] object-contain rounded-lg border border-border bg-black mb-4"
            />

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2 bg-background text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Close
              </button>
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  className="flex items-center gap-2 px-5 py-2 bg-foreground/80 text-secondary rounded-lg hover:bg-foreground transition ease-in-out cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
