import { useState } from "react";
import { FolderCreationUI } from "./folder/folder-creation/FolderCreationUI";
import { FileUploadUI } from "./file/FileUploaderUI";
import { FolderDialogBox } from "./folder/folder-dialog/FolderDialogBox";
import FolderList from "./folder/FolderList";
import { RenameFolderDialog } from "./folder/folder-dialog/RenameFolderDialog";
import DeleteFolderDialog from "./folder/folder-dialog/DeleteFolderDialog";
import CreateFolderDialog from "./folder/folder-dialog/CreateFolderDialog";
import { Breadcrumb } from "./folder/Breadcrumb";
import { useGetFolderPath } from "@/server/api/folder/useGetFolderPath";
import { ArrowLeft } from "lucide-react";
import { MoveFolderDialog } from "./folder/folder-dialog/MoveFolderDialog";
import { DeleteFileDialog } from "./file/file-dialog/DeleteFileDialog";
import { useGetFiles } from "@/server/api/files/useGetFolderFiles";
import { FileDialogBox } from "./file/file-dialog/FileContextMenuDialog";
import FileList from "./file/file-list/FileList";
import { FileUploadDialog } from "./file/file-dialog/FileUploadDialogComponent";
import { RenameFileDialog } from "./file/file-dialog/RenameFolderDialog";
import { useDownloadFile } from "@/server/api/files/useDownloadFile";
import { MoveFileDialog } from "./file/file-dialog/MoveFileDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FolderFileDashboard = () => {
  // Folder states
  const [folderContextMenu, setFolderContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    folderId: null as string | null,
  });
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [moveFolderOpen, setMoveFolderOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  //only for the alert dialogbox:
  const [previewErrorOpen, setPreviewErrorOpen] = useState(false);
  const [previewErrorType, setPreviewErrorType] = useState("");

  // File states
  const [fileContextMenu, setFileContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    fileId: null as string | null,
  });
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [deleteFileOpen, setDeleteFileOpen] = useState(false);
  const [renameFileOpen, setRenameFileOpen] = useState(false);
  const [moveFileOpen, setMoveFileOpen] = useState(false);
  const { onSubmit: downloadFile } = useDownloadFile();
  const { data: pathData, isLoading: isPathLoading } =
    useGetFolderPath(currentFolderId);
  const { data: filesData } = useGetFiles(currentFolderId);
  const breadcrumbPath = pathData?.data || [];

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleBreadcrumbNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };

  const handleBackNavigation = () => {
    if (breadcrumbPath.length > 0) {
      const parentFolder = breadcrumbPath[breadcrumbPath.length - 2];
      setCurrentFolderId(parentFolder?.id || null);
    } else {
      setCurrentFolderId(null);
    }
  };

  // Folder handlers
  const handleFolderContextMenu = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault();
    setFolderContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      folderId,
    });
  };

  const closeFolderContextMenu = () => {
    setFolderContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      folderId: null,
    });
  };

  const handleFolderOpen = () => {
    if (folderContextMenu.folderId) {
      setCurrentFolderId(folderContextMenu.folderId);
    }
  };

  const handleFolderMove = () => {
    setSelectedFolderId(folderContextMenu.folderId);
    setMoveFolderOpen(true);
  };

  const handleFolderRename = () => {
    const folderId = folderContextMenu.folderId;
    closeFolderContextMenu();
    if (folderId) {
      setSelectedFolderId(folderId);
      setRenameFolderOpen(true);
    }
  };

  const handleFolderDelete = () => {
    setSelectedFolderId(folderContextMenu.folderId);
    setDeleteFolderOpen(true);
  };

  const handleDeleteFolderSuccess = () => {
    if (breadcrumbPath.length > 0) {
      const parentFolder = breadcrumbPath[breadcrumbPath.length - 2];
      setCurrentFolderId(parentFolder?.id || null);
    } else {
      setCurrentFolderId(null);
    }
  };

  const handleFileClick = (fileId: string) => {
    const file = filesData?.data?.files?.find((f: any) => f._id === fileId);
    if (file) {
      // For images - open in new tab
      if (file.type === "image" && file.cloudinaryPublicId) {
        window.open(file.path, "_blank");
        return;
      }

      // For PDFs - open in new tab
      if (file.type === "pdf") {
        window.open(file.path, "_blank");
        return;
      }
      setPreviewErrorType(file.type.toUpperCase());
      setPreviewErrorOpen(true);
    }
  };

  const handleFileContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setFileContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      fileId,
    });
    setSelectedFileId(fileId);
  };

  const closeFileContextMenu = () => {
    setFileContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      fileId: null,
    });
  };

  const handleFileView = () => {
    const targetFile = filesData?.data?.files?.find(
      (f: any) => f._id === fileContextMenu.fileId,
    );

    if (!targetFile) {
      console.error("File not found");
      closeFileContextMenu();
      return;
    }

    // For images - open in new tab
    if (targetFile.type === "image" && targetFile.cloudinaryPublicId) {
      window.open(targetFile.path, "_blank");
      closeFileContextMenu();
      return;
    }

    // For PDFs - open in new tab
    if (targetFile.type === "pdf") {
      window.open(targetFile.path, "_blank");
      closeFileContextMenu();
      return;
    }

    // For other file types, download them
    handleFileDownload();
    closeFileContextMenu();
  };

  const handleFileEdit = () => {
    console.log("Edit file:", fileContextMenu.fileId);
    closeFileContextMenu();
    // TODO: Implement file edit
  };

  const handleFileDownload = async () => {
    const targetFile = filesData?.data?.files?.find(
      (f: any) => f._id === fileContextMenu.fileId,
    );

    if (!targetFile) {
      console.error("File not found");
      closeFileContextMenu();
      return;
    }

    try {
      await downloadFile({
        fileId: targetFile._id,
        fileName: targetFile.fileName,
      });
    } catch (error) {
      console.error("Download error:", error);
    }

    closeFileContextMenu();
  };

  const handleFileMove = () => {
    setSelectedFileId(fileContextMenu.fileId);
    setMoveFileOpen(true);
    closeFileContextMenu();
  };

  const handleFileRename = () => {
    setSelectedFileId(fileContextMenu.fileId);
    setRenameFileOpen(true);
    closeFileContextMenu();
  };

  const handleFileDelete = () => {
    setSelectedFileId(fileContextMenu.fileId);
    setDeleteFileOpen(true);
    closeFileContextMenu();
  };

  const handleFileUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadSuccess = () => {
    console.log("Files uploaded successfully");
  };

  const currentFile = filesData?.data?.files?.find(
    (f: any) => f._id === selectedFileId,
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            My Folders
          </h1>
          <p className="text-muted-foreground">
            Organize and manage your files efficiently
          </p>
        </div>

        {/* Back Button */}
        {currentFolderId && (
          <button
            onClick={handleBackNavigation}
            className="
              inline-flex items-center gap-2 px-4 py-2 mb-4
              text-sm font-medium text-foreground
              bg-card border border-border rounded-lg
              hover:bg-accent hover:text-accent-foreground
              transition-all duration-200
              hover-lift shadow-md
              animate-slide-in-left
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Breadcrumb */}
        <Breadcrumb
          items={breadcrumbPath}
          onNavigate={handleBreadcrumbNavigate}
          isLoading={isPathLoading}
        />

        {/* Folder & File Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
          <FolderCreationUI onClick={() => setCreateOpen(true)} />
          <FileUploadUI onClick={handleFileUploadClick} />
          <FolderList
            folderId={currentFolderId}
            onFolderClick={handleFolderClick}
            onFolderContextMenu={handleFolderContextMenu}
          />
          <FileList
            folderId={currentFolderId}
            onFileClick={handleFileClick}
            onFileContextMenu={handleFileContextMenu}
          />
        </div>
      </div>

      {/* Folder Context Menu */}
      <FolderDialogBox
        isOpen={folderContextMenu.isOpen}
        position={folderContextMenu.position}
        onClose={closeFolderContextMenu}
        onOpen={handleFolderOpen}
        onRename={handleFolderRename}
        onMove={handleFolderMove}
        onDelete={handleFolderDelete}
      />

      {/* File Context Menu */}
      <FileDialogBox
        isOpen={fileContextMenu.isOpen}
        position={fileContextMenu.position}
        onClose={closeFileContextMenu}
        onView={handleFileView}
        onEdit={handleFileEdit}
        onDownload={handleFileDownload}
        onMove={handleFileMove}
        onRename={handleFileRename}
        onDelete={handleFileDelete}
        editable={currentFile?.editable}
      />

      {/* Folder Dialogs */}
      {createOpen && (
        <CreateFolderDialog
          parentFolderId={currentFolderId}
          onClose={() => setCreateOpen(false)}
        />
      )}

      {renameFolderOpen && selectedFolderId && (
        <RenameFolderDialog
          folderId={selectedFolderId}
          onClose={() => {
            setRenameFolderOpen(false);
            setSelectedFolderId(null);
          }}
        />
      )}

      {deleteFolderOpen && selectedFolderId && (
        <DeleteFolderDialog
          folderId={selectedFolderId}
          onClose={() => {
            setDeleteFolderOpen(false);
            setSelectedFolderId(null);
          }}
          onSuccess={handleDeleteFolderSuccess}
        />
      )}

      {moveFolderOpen && selectedFolderId && (
        <MoveFolderDialog
          folderId={selectedFolderId}
          onClose={() => {
            setMoveFolderOpen(false);
            setSelectedFolderId(null);
          }}
        />
      )}

      {/* File Dialogs */}
      {uploadDialogOpen && (
        <FileUploadDialog
          isOpen={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          currentFolderId={currentFolderId}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {deleteFileOpen && selectedFileId && currentFile && (
        <DeleteFileDialog
          fileId={selectedFileId}
          fileName={currentFile.fileName}
          onClose={() => {
            setDeleteFileOpen(false);
            setSelectedFileId(null);
          }}
        />
      )}

      {renameFileOpen && selectedFileId && currentFile && (
        <RenameFileDialog
          fileId={selectedFileId}
          currentName={currentFile.fileName}
          onClose={() => {
            setRenameFileOpen(false);
            setSelectedFileId(null);
          }}
        />
      )}
      {moveFileOpen && selectedFileId && currentFile && (
        <MoveFileDialog
          fileId={selectedFileId}
          fileName={currentFile.fileName}
          currentFolderId={currentFolderId}
          onClose={() => {
            setMoveFileOpen(false);
            setSelectedFileId(null);
          }}
        />
      )}

      <AlertDialog open={previewErrorOpen} onOpenChange={setPreviewErrorOpen}>
        <AlertDialogContent className="w-[320px] p-4">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-base">
              Preview Not Available
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Cannot preview {previewErrorType} files. Please right-click and
              select Download.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end mt-4">
            <AlertDialogAction
              onClick={() => setPreviewErrorOpen(false)}
              className="h-8 px-3 text-sm"
            >
              OK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FolderFileDashboard;
