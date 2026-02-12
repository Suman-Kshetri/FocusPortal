import { useState } from "react";
import { FolderCreationUI } from "./folder/folder-creation/FolderCreationUI";
import { FolderDialogBox } from "./folder/folder-dialog/FolderDialogBox";
import FolderList from "./folder/FolderList";
import { RenameFolderDialog } from "./folder/folder-dialog/RenameFolderDialog";
import PropertiesDialog from "./folder/folder-dialog/PropertiesDialog";
import DeleteFolderDialog from "./folder/folder-dialog/DeleteFolderDialog";
import CreateFolderDialog from "./folder/folder-dialog/CreateFolderDialog";
import { Breadcrumb } from "./folder/Breadcrumb";
import { useGetFolderPath } from "@/server/api/folder/useGetFolderPath";
import { ArrowLeft } from "lucide-react";

const FolderFileDashboard = () => {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    folderId: null as string | null,
  });
  const [renameOpen, setRenameOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

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

  const handleCopy = () => {
    console.log("Copy folder:", contextMenu.folderId);
  };

  const handleMove = () => {
    console.log("Move folder:", contextMenu.folderId);
  };

  const handleRename = () => {
    setSelectedFolderId(contextMenu.folderId);
    setRenameOpen(true);
  };

  const handleProperties = () => {
    setSelectedFolderId(contextMenu.folderId);
    setPropertiesOpen(true);
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

        {/* Folder Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
          <FolderCreationUI onClick={() => setCreateOpen(true)} />
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
        onProperties={handleProperties}
        onCopy={handleCopy}
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

      {propertiesOpen && selectedFolderId && (
        <PropertiesDialog
          folderId={selectedFolderId}
          onClose={() => {
            setPropertiesOpen(false);
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
    </div>
  );
};

export default FolderFileDashboard;
