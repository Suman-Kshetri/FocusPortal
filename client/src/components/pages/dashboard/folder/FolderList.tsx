import { useGetFolderContents } from "@/server/api/folder/useGetFolderContent";
import { FolderCard } from "./folder-card/FolderCard";

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

  if (isLoading) return <p>Loading folders...</p>;
  if (error) return <p>Failed to load folders.</p>;

  const folders: Folder[] = data?.data?.data?.subFolders || [];

  if (folders.length === 0) {
    return <p className="text-muted-foreground">No folders found</p>;
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
