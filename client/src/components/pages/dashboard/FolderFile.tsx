import { useState } from "react";
import { FolderCreationUI } from "./folder/folder-creation/FolderCreationUI";
import { FolderDialogBox } from "./folder/folder-dialog/FolderDialogBox";
import FolderList from "./folder/FolderList";
import { RenameFolderDialog } from "./folder/folder-dialog/RenameFolderDialog";
import PropertiesDialog from "./folder/folder-dialog/PropertiesDialog";
import DeleteFolderDialog from "./folder/folder-dialog/DeleteFolderDialog";
import CreateFolderDialog from "./folder/folder-dialog/CreateFolderDialog";

const FolderFile = () => {
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

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
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
    console.log("Open folder:", contextMenu.folderId);
    // Add your open logic here
  };

  const handleCopy = () => {
    console.log("Copy folder:", contextMenu.folderId);
    // Add your copy logic here
  };

  const handleMove = () => {
    console.log("Move folder:", contextMenu.folderId);
    // Add your move logic here
  };

  const handleRename = () => {
    setRenameOpen(true);
  };

  const handleProperties = () => {
    setPropertiesOpen(true);
  };

  const handleDelete = () => {
    setDeleteOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-foreground mb-8">
          My Folders
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <FolderCreationUI onClick={() => setCreateOpen(true)} />
          <FolderList
            folderId={currentFolderId}
            onFolderClick={handleFolderClick}
            onFolderContextMenu={handleContextMenu}
          />
        </div>
      </div>
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
      {createOpen && (
        <CreateFolderDialog
          parentFolderId={currentFolderId}
          onClose={() => setCreateOpen(false)}
        />
      )}

      {renameOpen && (
        <RenameFolderDialog onClose={() => setRenameOpen(false)} />
      )}
      {propertiesOpen && (
        <PropertiesDialog onClose={() => setPropertiesOpen(false)} />
      )}
      {deleteOpen && (
        <DeleteFolderDialog onClose={() => setDeleteOpen(false)} />
      )}
    </div>
  );
};

export default FolderFile;
