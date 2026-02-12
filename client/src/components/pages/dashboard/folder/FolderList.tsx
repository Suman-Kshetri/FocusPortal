import { useGetFolderContents } from "@/server/api/folder/useGetFolderContent";
import { FolderCard } from "./folder-card/FolderCard";
import LoadingAnimation from "@/components/other/LoadingAnimation";

interface FolderListProps {
  folderId: string | null;
  onFolderClick: (folderId: string) => void;
  onFolderContextMenu: (e: React.MouseEvent, folderId: string) => void;
}

interface Folder {
  _id: string;
  folderName: string;
  owner: string;
  parentFolder: string | null;
  createdAt: string;
  updatedAt: string;
}

const FolderList = ({
  folderId,
  onFolderClick,
  onFolderContextMenu,
}: FolderListProps) => {
  const { data, isLoading, error } = useGetFolderContents(folderId || "root");

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-destructive">Failed to load folders.</p>
      </div>
    );
  }

  const folders: Folder[] = data?.data?.data?.subFolders || [];

  if (folders.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-muted-foreground">No folders found</p>
      </div>
    );
  }

  return (
    <>
      {folders.map((folder) => (
        <FolderCard
          key={folder._id}
          name={folder.folderName}
          onClick={() => onFolderClick(folder._id)}
          onContextMenu={(e) => onFolderContextMenu(e, folder._id)}
        />
      ))}
    </>
  );
};

export default FolderList;
