// components/file/FileList.tsx
import { useGetFiles } from "@/server/api/files/useGetFolderFiles";
import { Loader2 } from "lucide-react";
import { FileCard } from "../file-card/FileCard";

interface FileListProps {
  folderId: string | null;
  onFileClick: (fileId: string) => void;
  onFileContextMenu: (e: React.MouseEvent, fileId: string) => void;
}

const FileList = ({
  folderId,
  onFileClick,
  onFileContextMenu,
}: FileListProps) => {
  const { data, isLoading, isError } = useGetFiles(folderId);

  if (isLoading) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <p className="text-muted-foreground">Failed to load files</p>
      </div>
    );
  }

  const files = data?.data?.files || [];

  if (files.length === 0) {
    return null;
  }

  return (
    <>
      {files.map((file: any) => (
        <FileCard
          key={file._id}
          id={file._id}
          name={file.fileName}
          type={file.type}
          size={file.size}
          onClick={() => onFileClick(file._id)}
          onContextMenu={(e: React.MouseEvent) =>
            onFileContextMenu(e, file._id)
          }
        />
      ))}
    </>
  );
};

export default FileList;
