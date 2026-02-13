import { useState, useRef } from "react";
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

const FolderFileDashboard = () => {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    folderId: null as string | null,
  });
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [moveOpen, setMoveOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: pathData, isLoading: isPathLoading } =
    useGetFolderPath(currentFolderId);
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

  const handleContextMenu = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      folderId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, folderId: null });
  };

  const handleOpen = () => {
    if (contextMenu.folderId) {
      setCurrentFolderId(contextMenu.folderId);
    }
  };

  const handleMove = () => {
    setSelectedFolderId(contextMenu.folderId);
    setMoveOpen(true);
  };

  const handleRename = () => {
    const folderId = contextMenu.folderId;
    closeContextMenu();
    if (folderId) {
      setSelectedFolderId(folderId);
      setRenameOpen(true);
    }
  };

  const handleDelete = () => {
    setSelectedFolderId(contextMenu.folderId);
    setDeleteOpen(true);
  };

  const handleDeleteSuccess = () => {
    if (breadcrumbPath.length > 0) {
      const parentFolder = breadcrumbPath[breadcrumbPath.length - 2];
      setCurrentFolderId(parentFolder?.id || null);
    } else {
      setCurrentFolderId(null);
    }
  };

  // File upload handlers
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log("Selected files:", Array.from(files));
      console.log("Upload to folder:", currentFolderId);

      // TODO: Implement your file upload logic here
      // Example: uploadFiles(Array.from(files), currentFolderId);

      // Reset the input
      e.target.value = "";
    }
  };

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

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".docx,.jpg,.jpeg,.png,.gif,.webp,.pdf,.md,.xlsx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Folder Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
          <FolderCreationUI onClick={() => setCreateOpen(true)} />
          <FileUploadUI onClick={handleFileUploadClick} />
          <FolderList
            folderId={currentFolderId}
            onFolderClick={handleFolderClick}
            onFolderContextMenu={handleContextMenu}
          />
        </div>
      </div>

      {/* Context Menu */}
      <FolderDialogBox
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={closeContextMenu}
        onOpen={handleOpen}
        onRename={handleRename}
        onMove={handleMove}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      {createOpen && (
        <CreateFolderDialog
          parentFolderId={currentFolderId}
          onClose={() => setCreateOpen(false)}
        />
      )}

      {renameOpen && selectedFolderId && (
        <RenameFolderDialog
          folderId={selectedFolderId}
          onClose={() => {
            setRenameOpen(false);
            setSelectedFolderId(null);
          }}
        />
      )}

      {deleteOpen && selectedFolderId && (
        <DeleteFolderDialog
          folderId={selectedFolderId}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedFolderId(null);
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}
      {moveOpen && selectedFolderId && (
        <MoveFolderDialog
          folderId={selectedFolderId}
          onClose={() => {
            setMoveOpen(false);
            setSelectedFolderId(null);
          }}
        />
      )}
    </div>
  );
};

export default FolderFileDashboard;
